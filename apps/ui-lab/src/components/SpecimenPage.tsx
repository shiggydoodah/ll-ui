import { Component, useEffect, useState, type ReactNode } from 'react';
import { usePropEditor } from '@/types/prop-editor-context';
import { defaultRenderProps } from '@ll-ui/react/specimens';
import type { SpecimenConfig } from '@ll-ui/react/specimens';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  specimen: SpecimenConfig<any>;
};

type PreviewErrorBoundaryProps = {
  children: ReactNode;
  onReset: () => void;
};

type PreviewErrorBoundaryState = {
  error: Error | null;
};

// A crashing prop combination should cost you the preview panel, not the page.
// Catches render errors from the specimen component and offers a reset back to
// the specimen's default props.
class PreviewErrorBoundary extends Component<PreviewErrorBoundaryProps, PreviewErrorBoundaryState> {
  override state: PreviewErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): PreviewErrorBoundaryState {
    return { error };
  }

  handleReset = () => {
    this.props.onReset();
    this.setState({ error: null });
  };

  override render() {
    if (this.state.error) {
      return (
        <div
          role="alert"
          className="flex w-full flex-col items-center gap-3 rounded-md border border-(--ui-border) bg-(--ui-background-subtle) p-6 text-center"
        >
          <p className="text-sm font-medium text-(--ui-foreground)">
            This prop combination crashed the component.
          </p>
          <p className="font-mono text-xs text-(--ui-text-subtle)">{this.state.error.message}</p>
          <button
            type="button"
            onClick={this.handleReset}
            className="cursor-pointer rounded-md border border-(--ui-border-strong) px-3 py-1.5 text-sm text-(--ui-foreground) transition-colors hover:border-(--ui-accent)"
          >
            Reset props
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Each specimen route renders its own SpecimenPage element, so navigating
// between specimens unmounts one instance and mounts a fresh one — this
// sidesteps the need to track cross-render initialization state entirely.
export const SpecimenPage = ({ specimen }: Props) => {
  const context = usePropEditor();
  const [activeVariant, setActiveVariant] = useState(0);

  // Compute safe defaults synchronously so they are ready on the first render:
  // every PropEditor-controlled prop's default, plus variant[0]'s uncontrolled
  // static props. Shared with the render/SSR suites and the design-kit exporter
  // so all four render the same default state.
  const defaultProps = defaultRenderProps(specimen);

  // isInitialized: true once the first useEffect has fired and set specimen context.
  // We use a dedicated state flag (separate from context) so that the first render
  // of a freshly-mounted instance skips stale context.props from the previous
  // specimen — e.g. a `children` prop from Button should not land on an <input>.
  // The flag is only ever set from inside the effect's subscribe callback, not in
  // the effect body itself, to comply with react-hooks/set-state-in-effect.
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    context.setSpecimen(specimen.argTypes, defaultProps);
    // Schedule the state update outside the synchronous effect body so we satisfy
    // react-hooks/set-state-in-effect while still getting a re-render after the
    // context is ready.
    const handle = requestAnimationFrame(() => setIsInitialized(true));
    return () => cancelAnimationFrame(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectVariant = (index: number) => {
    setActiveVariant(index);
    const variant = specimen.variants[index];
    if (variant) {
      context.setProps({
        ...defaultProps,
        ...variant.props,
      } as Record<string, unknown>);
    }
  };

  // Restores the specimen's defaults — used by the error boundary so "Reset
  // props" lands on a known-good prop set before re-rendering the component.
  const resetToDefaults = () => {
    setActiveVariant(0);
    context.setProps(defaultProps);
  };

  // After the first effect fires and the context is ready, layer context.props
  // on top so the PropEditor and variant buttons take effect.
  const renderProps = isInitialized ? { ...defaultProps, ...context.props } : defaultProps;

  const Component = specimen.component;

  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-bold text-(--ui-foreground)">{specimen.title}</h1>
        {specimen.description && (
          <p className="mt-1 text-sm text-(--ui-text-subtle)">{specimen.description}</p>
        )}
      </div>

      {specimen.variants.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {specimen.variants.map((variant, i) => (
            <button
              key={variant.name}
              type="button"
              onClick={() => selectVariant(i)}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                i === activeVariant
                  ? 'border-(--ui-accent) bg-(--ui-accent) text-white'
                  : 'border-(--ui-border) bg-transparent text-(--ui-foreground) hover:border-(--ui-accent)'
              }`}
            >
              {variant.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex min-h-32 items-center justify-center rounded-lg border border-(--ui-border) bg-(--ui-background) p-8">
        <PreviewErrorBoundary onReset={resetToDefaults}>
          <Component {...renderProps} />
        </PreviewErrorBoundary>
      </div>
    </div>
  );
};

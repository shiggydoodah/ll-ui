import { createFileRoute } from '@tanstack/react-router';
import { useState, type ReactNode } from 'react';

import { Toaster, notify } from '@ll-ui/react';
import type { NotifyOptions } from '@ll-ui/react';
import { Button } from '@ll-ui/react/primitives';

type DurationMode = 'default' | 'auto' | 'manual';

const durationSeconds: Record<DurationMode, number | undefined> = {
  default: undefined,
  auto: 3,
  manual: Infinity,
};

const durationLabel: Record<DurationMode, string> = {
  default: 'Default',
  auto: 'Auto 3s',
  manual: 'Manual (∞)',
};

const positions = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const;

type ToastPosition = (typeof positions)[number];

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="flex flex-col gap-3">
    <h2 className="font-display text-lg font-bold">{title}</h2>
    {children}
  </section>
);

const ToggleChip = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) => (
  <Button
    size="small"
    tone={active ? 'green' : 'neutral'}
    variant={active ? 'solid' : 'outline'}
    onClick={onClick}
  >
    {children}
  </Button>
);

const ToastDemo = () => {
  const [duration, setDuration] = useState<DurationMode>('default');
  const [position, setPosition] = useState<ToastPosition>('bottom-right');
  const [withDescription, setWithDescription] = useState(true);
  const [withAction, setWithAction] = useState(false);

  // Build the per-call options from the active controls.
  const options = (extra?: NotifyOptions): NotifyOptions => ({
    duration: durationSeconds[duration],
    position,
    ...(withDescription ? { description: 'Additional context for this notification.' } : {}),
    ...(withAction ? { action: { label: 'Undo', onClick: () => notify.message('Undone') } } : {}),
    ...extra,
  });

  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Mount point for toasts on this page. */}
      <Toaster position={position} />

      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Toast</h1>
        <p className="text-sm text-(--ui-text-subtle)">
          Sonner-based toasts fired imperatively via <code>notify</code>. Tune the options below,
          then fire a toast. Auto-dismiss is expressed in seconds; <code>Infinity</code> keeps a
          toast until it is manually dismissed.
        </p>
      </header>

      <Section title="Options">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-(--ui-text-subtle)">Duration</span>
          <div className="flex flex-wrap gap-2">
            {(['default', 'auto', 'manual'] as const).map((mode) => (
              <Button
                key={mode}
                size="small"
                tone="neutral"
                variant={duration === mode ? 'solid' : 'outline'}
                onClick={() => setDuration(mode)}
              >
                {durationLabel[mode]}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs text-(--ui-text-subtle)">Position</span>
          <div className="flex flex-wrap gap-2">
            {positions.map((pos) => (
              <Button
                key={pos}
                size="small"
                tone="neutral"
                variant={position === pos ? 'solid' : 'outline'}
                onClick={() => setPosition(pos)}
              >
                {pos}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs text-(--ui-text-subtle)">Content</span>
          <div className="flex flex-wrap gap-2">
            <ToggleChip active={withDescription} onClick={() => setWithDescription((v) => !v)}>
              Description: {withDescription ? 'on' : 'off'}
            </ToggleChip>
            <ToggleChip active={withAction} onClick={() => setWithAction((v) => !v)}>
              Action button: {withAction ? 'on' : 'off'}
            </ToggleChip>
          </div>
        </div>
      </Section>

      <Section title="Fire a toast">
        <div className="flex flex-wrap gap-2">
          <Button
            size="small"
            tone="green"
            onClick={() => notify.success('Profile updated', options())}
          >
            Success
          </Button>
          <Button size="small" tone="red" onClick={() => notify.error('Update failed', options())}>
            Error
          </Button>
          <Button
            size="small"
            tone="blue"
            onClick={() => notify.info('New message from Alex', options())}
          >
            Info (new DM)
          </Button>
          <Button size="small" tone="amber" onClick={() => notify.warning('Heads up', options())}>
            Warning
          </Button>
          <Button
            size="small"
            tone="neutral"
            variant="outline"
            onClick={() => notify.message('Plain message', options())}
          >
            Message
          </Button>
        </div>
      </Section>

      <Section title="Lifecycle helpers">
        <div className="flex flex-wrap gap-2">
          <Button
            size="small"
            tone="neutral"
            variant="outline"
            onClick={() => {
              const id = notify.loading('Saving…');
              window.setTimeout(() => notify.success('Saved', { id }), 1500);
            }}
          >
            Loading → success
          </Button>
          <Button
            size="small"
            tone="purple"
            variant="outline"
            onClick={() =>
              notify.promise(new Promise((resolve) => window.setTimeout(resolve, 1500)), {
                loading: 'Uploading…',
                success: 'Uploaded',
                error: 'Upload failed',
              })
            }
          >
            Promise
          </Button>
          <Button
            size="small"
            tone="neutral"
            variant="outline"
            onClick={() =>
              notify.custom(
                (id) => (
                  <div className="flex items-center gap-3 rounded-md border border-(--ui-border-strong) bg-(--ui-background) px-4 py-3 text-sm text-(--ui-foreground)">
                    <span>Fully custom toast</span>
                    <Button
                      size="xsmall"
                      tone="neutral"
                      variant="outline"
                      onClick={() => notify.dismiss(id)}
                    >
                      Close
                    </Button>
                  </div>
                ),
                options(),
              )
            }
          >
            Custom
          </Button>
          <Button size="small" tone="neutral" variant="ghost" onClick={() => notify.dismiss()}>
            Dismiss all
          </Button>
        </div>
      </Section>
    </div>
  );
};

export const Route = createFileRoute('/components/composed/toast')({
  component: ToastDemo,
});

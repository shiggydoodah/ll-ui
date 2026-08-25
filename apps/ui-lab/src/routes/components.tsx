import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useState } from 'react';
import { PropEditor } from '@/components/PropEditor';
import { PropEditorContext, type EditorArgTypes } from '@/types/prop-editor-context';

const ComponentsLayout = () => {
  const [argTypes, setArgTypes] = useState<EditorArgTypes>({});
  const [props, setProps] = useState<Record<string, unknown>>({});

  const setSpecimen = (nextArgTypes: EditorArgTypes, defaultProps: Record<string, unknown>) => {
    setArgTypes(nextArgTypes);
    setProps(defaultProps);
  };

  return (
    <PropEditorContext.Provider value={{ argTypes, props, setProps, setSpecimen }}>
      <div className="flex h-full min-h-0">
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
        <aside className="flex w-70 shrink-0 flex-col border-l border-(--ui-border) bg-(--ui-background)">
          <div className="border-b border-(--ui-border) px-4 py-3">
            <span className="text-xs font-semibold tracking-wider text-(--ui-text-subtle) uppercase">
              Props
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <PropEditor />
          </div>
        </aside>
      </div>
    </PropEditorContext.Provider>
  );
};

export const Route = createFileRoute('/components')({
  component: ComponentsLayout,
});

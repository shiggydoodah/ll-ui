import { usePropEditor } from '@/types/prop-editor-context';

const labelClass = 'block text-xs font-medium text-(--ui-text-subtle) mb-1';
const inputClass =
  'w-full rounded border border-(--ui-border) bg-(--ui-background) px-2 py-1.5 text-sm text-(--ui-foreground) focus:outline-none focus:ring-1 focus:ring-(--ui-focus-ring)';

export const PropEditor = () => {
  const { argTypes, props, setProps } = usePropEditor();

  const keys = Object.keys(argTypes);

  if (keys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
        <span className="text-sm text-(--ui-text-subtle)">No component selected</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {keys.map((key) => {
        const def = argTypes[key];
        if (!def) return null;
        const value = props[key];
        // Prop keys are unique within an editor, so they make a stable control id
        // — which also gives the label something to point at.
        const controlId = `prop-${key}`;

        // The boolean control is a `role="switch"` button, which `<label for>`
        // cannot target — it names itself with `aria-label` instead.
        const isLabelable = def.control !== 'boolean';

        return (
          <div key={key}>
            <label className={labelClass} htmlFor={isLabelable ? controlId : undefined}>
              {key}
            </label>

            {def.control === 'text' && (
              <input
                id={controlId}
                name={key}
                type="text"
                className={inputClass}
                value={typeof value === 'string' ? value : ''}
                onChange={(e) => setProps({ ...props, [key]: e.target.value })}
              />
            )}

            {def.control === 'number' && (
              <input
                id={controlId}
                name={key}
                type="number"
                className={inputClass}
                value={typeof value === 'number' && !Number.isNaN(value) ? value : ''}
                onChange={(e) => {
                  // valueAsNumber reports NaN for an empty field; storing NaN
                  // wedges the input, so treat "cleared" as prop-not-set.
                  const next = e.target.valueAsNumber;
                  setProps({ ...props, [key]: Number.isNaN(next) ? undefined : next });
                }}
              />
            )}

            {def.control === 'color' && (
              <div className="flex items-center gap-2">
                <input
                  id={controlId}
                  name={key}
                  type="color"
                  className="h-8 w-8 cursor-pointer rounded border border-(--ui-border) bg-transparent p-0.5"
                  value={typeof value === 'string' ? value : '#000000'}
                  onChange={(e) => setProps({ ...props, [key]: e.target.value })}
                />
                <span className="font-mono text-xs text-(--ui-text-subtle)">
                  {typeof value === 'string' ? value : '#000000'}
                </span>
              </div>
            )}

            {def.control === 'boolean' && (
              <button
                type="button"
                role="switch"
                aria-label={key}
                aria-checked={!!value}
                onClick={() => setProps({ ...props, [key]: !value })}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:ring-2 focus:ring-(--ui-focus-ring) focus:ring-offset-1 focus:outline-none ${
                  value ? 'bg-(--ui-accent)' : 'bg-(--ui-border)'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    value ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            )}

            {def.control === 'select' && 'options' in def && (
              <select
                id={controlId}
                name={key}
                className={inputClass}
                value={typeof value === 'string' || typeof value === 'number' ? String(value) : ''}
                onChange={(e) => {
                  const raw = e.target.value;
                  const matched = (def.options as readonly unknown[]).find(
                    (o) => String(o) === raw,
                  );
                  setProps({ ...props, [key]: matched ?? raw });
                }}
              >
                {(def.options as readonly unknown[]).map((opt) => (
                  <option key={String(opt)} value={String(opt)}>
                    {String(opt)}
                  </option>
                ))}
              </select>
            )}
          </div>
        );
      })}
    </div>
  );
};

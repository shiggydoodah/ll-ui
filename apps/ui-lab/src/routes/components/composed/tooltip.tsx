import { createFileRoute } from '@tanstack/react-router';
import { useState, type ReactNode } from 'react';

import { Tooltip, TooltipContent, TooltipRoot, TooltipTrigger } from '@ll-ui/react/components';
import { Button } from '@ll-ui/react/primitives';
import { Bell, Copy, Info, Pencil, Settings, Trash2 } from '@ll-ui/react/icons';

type Side = 'top' | 'right' | 'bottom' | 'left';
type Align = 'start' | 'center' | 'end';

const sides: Side[] = ['top', 'right', 'bottom', 'left'];
const aligns: Align[] = ['start', 'center', 'end'];

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="flex flex-col gap-3">
    <h2 className="font-display text-lg font-bold">{title}</h2>
    {children}
  </section>
);

// Icon-only trigger. The visible name comes from `aria-label`; the Tooltip adds the
// supplementary description via `aria-describedby`.
const IconTrigger = ({ label, children }: { label: string; children: ReactNode }) => (
  <Tooltip content={label}>
    <Button tone="neutral" variant="outline" size="small" aria-label={label}>
      {children}
    </Button>
  </Tooltip>
);

const TooltipDemo = () => {
  const [side, setSide] = useState<Side>('top');
  const [align, setAlign] = useState<Align>('center');
  const [showArrow, setShowArrow] = useState(false);

  return (
    <div className="flex flex-col gap-8 p-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Tooltip</h1>
        <p className="text-sm text-(--ui-text-subtle)">
          A small, accessible overlay built on <code>Popover</code>. It shows on{' '}
          <strong>hover</strong> and <strong>keyboard focus</strong>, dismisses on leave, blur,{' '}
          <kbd>Esc</kbd> or outside interaction, and never traps focus. On <strong>touch</strong>{' '}
          devices (no hover) a tap toggles it. The content is exposed as{' '}
          <code>role=&quot;tooltip&quot;</code> and linked to the trigger via{' '}
          <code>aria-describedby</code>. Use the convenience <code>Tooltip</code> for the common
          case, or compose <code>TooltipRoot</code> / <code>TooltipTrigger</code> /{' '}
          <code>TooltipContent</code> for full control.
        </p>
      </header>

      <Section title="Placement">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-(--ui-text-subtle)">Side</span>
          <div className="flex flex-wrap gap-2">
            {sides.map((s) => (
              <Button
                key={s}
                size="small"
                tone="neutral"
                variant={side === s ? 'solid' : 'outline'}
                onClick={() => setSide(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs text-(--ui-text-subtle)">Align</span>
          <div className="flex flex-wrap gap-2">
            {aligns.map((a) => (
              <Button
                key={a}
                size="small"
                tone="neutral"
                variant={align === a ? 'solid' : 'outline'}
                onClick={() => setAlign(a)}
              >
                {a}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs text-(--ui-text-subtle)">Arrow</span>
          <div className="flex flex-wrap gap-2">
            <Button
              size="small"
              tone={showArrow ? 'green' : 'neutral'}
              variant={showArrow ? 'solid' : 'outline'}
              onClick={() => setShowArrow((v) => !v)}
            >
              Arrow: {showArrow ? 'on' : 'off'}
            </Button>
          </div>
        </div>

        <div className="flex min-h-40 items-center justify-center rounded-lg border border-(--ui-border) p-8">
          <Tooltip
            content={`Rendered on the ${side} side, aligned ${align}.`}
            side={side}
            align={align}
            showArrow={showArrow}
          >
            <Button tone="neutral">Hover or focus me</Button>
          </Tooltip>
        </div>
      </Section>

      <Section title="Icon buttons">
        <p className="text-sm text-(--ui-text-subtle)">
          The classic use: name an icon-only control. Keyboard users get the same hint on focus.
        </p>
        <div className="flex flex-wrap gap-2">
          <IconTrigger label="Edit">
            <Pencil aria-hidden size={16} />
          </IconTrigger>
          <IconTrigger label="Copy link">
            <Copy aria-hidden size={16} />
          </IconTrigger>
          <IconTrigger label="Notifications">
            <Bell aria-hidden size={16} />
          </IconTrigger>
          <IconTrigger label="Settings">
            <Settings aria-hidden size={16} />
          </IconTrigger>
          <IconTrigger label="Delete">
            <Trash2 aria-hidden size={16} />
          </IconTrigger>
        </div>
      </Section>

      <Section title="Inline help">
        <p className="flex items-center gap-1.5 text-sm">
          Monthly spend limit
          <Tooltip content="The most this card can be charged in a calendar month." side="top">
            <button
              type="button"
              aria-label="About the monthly spend limit"
              className="inline-flex size-5 items-center justify-center rounded-full text-(--ui-text-subtle) outline-none hover:text-(--ui-foreground) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ui-focus-ring)"
            >
              <Info aria-hidden size={15} />
            </button>
          </Tooltip>
        </p>
      </Section>

      <Section title="Compound parts">
        <p className="text-sm text-(--ui-text-subtle)">
          Drop down to <code>TooltipRoot</code> / <code>TooltipTrigger</code> /{' '}
          <code>TooltipContent</code> when you need richer content or per-part control.
        </p>
        <div className="flex flex-wrap gap-4">
          <TooltipRoot openDelay={120}>
            <TooltipTrigger>
              <Button tone="neutral" variant="outline">
                Save
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" showArrow>
              <span className="flex items-center gap-2">
                Save changes
                <kbd className="rounded border border-(--ui-border-strong) bg-(--ui-foreground)/8 px-1.5 py-0.5 text-xs">
                  ⌘S
                </kbd>
              </span>
            </TooltipContent>
          </TooltipRoot>

          <Tooltip content="This action is permanent." side="top" disabled>
            <Button tone="neutral" variant="outline">
              Tooltip disabled
            </Button>
          </Tooltip>
        </div>
      </Section>
    </div>
  );
};

export const Route = createFileRoute('/components/composed/tooltip')({
  component: TooltipDemo,
});

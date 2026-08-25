import { createFileRoute } from '@tanstack/react-router';
import { useState, type ReactNode } from 'react';

import {
  Field,
  FieldControl,
  FieldLabel,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@ll-ui/react/components';
import { Button, Input } from '@ll-ui/react/primitives';
import { Bell, CreditCard, Flag, LogOut, Settings, ShieldAlert, User } from '@ll-ui/react/icons';

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

// A single row inside a menu-style popover. Wrapping a button in PopoverClose makes
// selecting the row dismiss the popover, mirroring real menu behaviour.
const MenuItem = ({ icon, children }: { icon: ReactNode; children: ReactNode }) => (
  <PopoverClose className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm text-(--ui-text-body) outline-none hover:bg-(--ui-foreground)/8 focus-visible:bg-(--ui-foreground)/8">
    <span className="shrink-0 text-(--ui-text-subtle)">{icon}</span>
    {children}
  </PopoverClose>
);

const PopoverDemo = () => {
  const [side, setSide] = useState<Side>('bottom');
  const [align, setAlign] = useState<Align>('center');
  const [showArrow, setShowArrow] = useState(false);

  return (
    <div className="flex flex-col gap-8 p-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Popover</h1>
        <p className="text-sm text-(--ui-text-subtle)">
          A composable, accessible floating surface built on Radix. Compose <code>Popover</code>,{' '}
          <code>PopoverTrigger</code> and <code>PopoverContent</code> with any trigger and any
          content — menus, settings, forms, rich media. Placement, the arrow and animations are
          owned by <code>PopoverContent</code>.
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
          <Popover>
            <PopoverTrigger asChild>
              <Button tone="neutral">Open popover</Button>
            </PopoverTrigger>
            <PopoverContent side={side} align={align} showArrow={showArrow}>
              <div className="flex flex-col gap-1">
                <p className="font-display font-bold">Placement</p>
                <p className="text-sm text-(--ui-text-subtle)">
                  Rendered on the <strong>{side}</strong> side, aligned <strong>{align}</strong>.
                  Radix flips to stay in view near edges.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </Section>

      <Section title="Account menu">
        <div className="flex flex-wrap gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button tone="neutral" variant="outline">
                <User aria-hidden size={16} /> Account
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-56 p-1.5">
              <MenuItem icon={<User size={16} />}>Profile</MenuItem>
              <MenuItem icon={<Settings size={16} />}>Settings</MenuItem>
              <MenuItem icon={<CreditCard size={16} />}>Billing</MenuItem>
              <MenuItem icon={<Bell size={16} />}>Notifications</MenuItem>
              <div className="my-1 border-t border-(--ui-border)" />
              <MenuItem icon={<LogOut size={16} />}>Sign out</MenuItem>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button tone="red" variant="outline">
                <Flag aria-hidden size={16} /> Report
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-60 p-1.5">
              <p className="px-2.5 py-1.5 text-xs font-medium text-(--ui-text-subtle)">
                Report this post
              </p>
              <MenuItem icon={<ShieldAlert size={16} />}>Spam or misleading</MenuItem>
              <MenuItem icon={<ShieldAlert size={16} />}>Harassment</MenuItem>
              <MenuItem icon={<ShieldAlert size={16} />}>Hate speech</MenuItem>
              <MenuItem icon={<ShieldAlert size={16} />}>Something else</MenuItem>
            </PopoverContent>
          </Popover>
        </div>
      </Section>

      <Section title="Rich content">
        <div className="flex flex-wrap gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button tone="neutral" variant="outline">
                Profile card
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" showArrow>
              <div className="flex flex-col gap-3">
                {/* Self-contained decorative cover (no external hosts, works
                    offline and under a strict CSP) drawn from theme tokens. */}
                <svg
                  role="img"
                  aria-label="Cover"
                  viewBox="0 0 320 80"
                  preserveAspectRatio="none"
                  className="h-20 w-full rounded-md"
                >
                  <defs>
                    <linearGradient id="profile-cover" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="var(--ui-accent)" />
                      <stop offset="100%" stopColor="var(--ui-background-subtle)" />
                    </linearGradient>
                  </defs>
                  <rect width="320" height="80" fill="url(#profile-cover)" />
                  <circle cx="270" cy="18" r="34" fill="var(--ui-background)" fillOpacity="0.25" />
                  <circle cx="40" cy="72" r="26" fill="var(--ui-background)" fillOpacity="0.15" />
                </svg>
                <div className="flex flex-col gap-0.5">
                  <p className="font-display font-bold">Alex Rivera</p>
                  <p className="text-sm text-(--ui-text-subtle)">
                    Product designer. Building delightful interfaces and design systems.
                  </p>
                </div>
                <Button size="small" tone="neutral">
                  Follow
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button tone="neutral" variant="outline">
                Quick form
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start">
              <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                <Field name="display-name">
                  <FieldLabel>Display name</FieldLabel>
                  <FieldControl>
                    <Input defaultValue="Alex Rivera" />
                  </FieldControl>
                </Field>
                <div className="flex justify-end gap-2">
                  <PopoverClose asChild>
                    <Button size="small" tone="neutral" variant="ghost">
                      Cancel
                    </Button>
                  </PopoverClose>
                  <PopoverClose asChild>
                    <Button size="small" tone="neutral" type="submit">
                      Save
                    </Button>
                  </PopoverClose>
                </div>
              </form>
            </PopoverContent>
          </Popover>
        </div>
      </Section>
    </div>
  );
};

export const Route = createFileRoute('/components/composed/popover')({
  component: PopoverDemo,
});

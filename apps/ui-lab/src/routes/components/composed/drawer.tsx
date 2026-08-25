import { createFileRoute } from '@tanstack/react-router';
import { useState, type ReactNode } from 'react';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Field,
  FieldControl,
  FieldLabel,
} from '@ll-ui/react/components';
import { Button, Input } from '@ll-ui/react/primitives';

type Direction = 'top' | 'right' | 'bottom' | 'left';

const directions: Direction[] = ['top', 'right', 'bottom', 'left'];

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="flex flex-col gap-3">
    <h2 className="font-display text-lg font-bold">{title}</h2>
    {children}
  </section>
);

const DrawerDemo = () => {
  const [direction, setDirection] = useState<Direction>('right');

  return (
    <div className="flex flex-col gap-8 p-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Drawer</h1>
        <p className="text-sm text-(--ui-text-subtle)">
          A slide-out panel built on{' '}
          <a
            href="https://github.com/emilkowalski/vaul"
            target="_blank"
            rel="noreferrer"
            className="text-(--ui-accent) underline"
          >
            vaul
          </a>{' '}
          (itself on Radix Dialog), so it gets a focus trap, scroll lock, <kbd>Esc</kbd>-to-close
          and the <code>role=&quot;dialog&quot;</code> wiring for free, plus drag-to-dismiss.
          Compose <code>Drawer</code>, <code>DrawerTrigger</code> and <code>DrawerContent</code>{' '}
          with <code>DrawerHeader</code>/<code>DrawerFooter</code> and a <code>DrawerTitle</code>.
          Styled purely with <code>--ui-*</code> tokens, so it works in any app.
        </p>
      </header>

      <Section title="Direction">
        <p className="text-sm text-(--ui-text-subtle)">
          The same component slides in from any edge. Top/bottom are full-width sheets; left/right
          are side panels. Bottom shows a drag handle.
        </p>
        <div className="flex flex-wrap gap-2">
          {directions.map((d) => (
            <Button
              key={d}
              size="small"
              tone="neutral"
              variant={direction === d ? 'solid' : 'outline'}
              onClick={() => setDirection(d)}
            >
              {d}
            </Button>
          ))}
        </div>

        <div className="flex min-h-40 items-center justify-center rounded-lg border border-(--ui-border) p-8">
          <Drawer direction={direction}>
            <DrawerTrigger asChild>
              <Button tone="neutral">Open {direction} drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Edit profile</DrawerTitle>
                <DrawerDescription>
                  This drawer slid in from the <strong>{direction}</strong> edge.
                </DrawerDescription>
              </DrawerHeader>
              <div className="px-4 text-sm text-(--ui-text-muted)">
                Drag the panel (or press Escape, or click the backdrop) to dismiss it.
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button>Done</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </Section>

      <Section title="Form in a drawer">
        <p className="text-sm text-(--ui-text-subtle)">
          A common pattern: a focused editing surface that traps focus and returns it to the trigger
          on close. <code>DrawerClose</code> wraps the actions.
        </p>
        <div className="flex flex-wrap gap-4">
          <Drawer direction="right">
            <DrawerTrigger asChild>
              <Button tone="neutral" variant="outline">
                Edit profile
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Edit profile</DrawerTitle>
                <DrawerDescription>Update your details, then save.</DrawerDescription>
              </DrawerHeader>
              <form
                id="drawer-profile-form"
                className="flex flex-col gap-3 px-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <Field name="drawer-name">
                  <FieldLabel>Display name</FieldLabel>
                  <FieldControl>
                    <Input defaultValue="Alex Rivera" />
                  </FieldControl>
                </Field>
                <Field name="drawer-email">
                  <FieldLabel>Email</FieldLabel>
                  <FieldControl>
                    <Input type="email" defaultValue="alex@example.com" />
                  </FieldControl>
                </Field>
              </form>
              <DrawerFooter>
                <DrawerClose asChild>
                  {/* Lives in the footer, outside the <form> — the form attribute
                      keeps it a real submit button for that form. */}
                  <Button type="submit" form="drawer-profile-form">
                    Save changes
                  </Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button tone="neutral" variant="outline">
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </Section>

      <Section title="Scrollable content">
        <p className="text-sm text-(--ui-text-subtle)">
          Long content scrolls within the panel while the header and footer stay put.
        </p>
        <Drawer direction="right">
          <DrawerTrigger asChild>
            <Button tone="neutral" variant="outline">
              Open terms
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Terms of service</DrawerTitle>
              <DrawerDescription>Please review before continuing.</DrawerDescription>
            </DrawerHeader>
            <div className="flex-1 overflow-y-auto px-4 text-sm text-(--ui-text-muted)">
              {Array.from({ length: 20 }).map((_, i) => (
                <p key={i} className="mb-3">
                  {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua.
                </p>
              ))}
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button>Accept</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Section>
    </div>
  );
};

export const Route = createFileRoute('/components/composed/drawer')({
  component: DrawerDemo,
});

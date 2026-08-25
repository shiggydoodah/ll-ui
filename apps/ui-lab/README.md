# ll-lab

The specimen playground for [`@ll-ui/react`](../../packages/ui). A local Vite + TanStack Router SPA (package name `@ll-ui/lab`) for viewing library components in isolation, trying prop combinations live, switching themes and modes, and exercising the TanStack Form integration.

This is not production code — it exists to develop and QA the library.

---

## Prerequisites

- Node ≥ 22.13
- pnpm ≥ 11
- Dependencies installed from the repo root: `pnpm install`

## Getting started

```bash
pnpm dev          # from the repo root
```

Opens at `http://localhost:4100` (set the `PORT` env var to change it).

---

## How it works

Specimens live **in the library**, colocated with each component (`packages/ui/src/**/*.specimen.ts`) and re-exported from the registry at `@ll-ui/react/specimens`. A specimen declares:

- `component` — the `@ll-ui/react` component to render
- `argTypes` — prop controls (`text | boolean | number | color | select`) with default values; these auto-generate the Props panel
- `variants` — named preset prop combinations shown as clickable buttons

ll-lab's job is just to render them:

```
src/
├── routes/                     # File-based routes (TanStack Router)
│   ├── components/primitives/  # One route per primitive → <SpecimenPage>
│   ├── components/composed/    # One route per composed component
│   ├── components/integrations/# DataTable etc.
│   └── forms.tsx               # TanStack Form showcase (LoginForm + RegisterForm)
├── components/
│   ├── SpecimenPage.tsx        # Variant switcher + live preview (with error boundary)
│   └── PropEditor.tsx          # Auto-generated prop controls from argTypes
├── form/                       # Lab-local form field wrappers (PasswordField, useAppForm)
├── forms/                      # Demo forms + zod schemas + tests
└── nav.config.ts               # Sidebar tree, typed against the generated route tree
```

## Adding a component to the lab

1. **In the library**: create `<name>.specimen.ts` next to the component and register it in `packages/ui/src/specimens/index.ts` (named export + `allSpecimens`).
2. **Route**: create `src/routes/components/<primitives|composed>/<name>.tsx`:

   ```tsx
   import { createFileRoute } from '@tanstack/react-router';
   import { SpecimenPage } from '@/components/SpecimenPage';
   import { myThingSpecimen } from '@ll-ui/react/specimens';

   export const Route = createFileRoute('/components/composed/my-thing')({
     component: () => <SpecimenPage specimen={myThingSpecimen} />,
   });
   ```

   The route tree (`src/routeTree.gen.ts`) regenerates automatically during dev/build.

3. **Nav**: add `{ label: 'MyThing', path: '/components/composed/my-thing' }` to `src/nav.config.ts`. Paths are typed as `keyof FileRoutesByTo`, so a typo or renamed route is a compile error.

## Theme and mode switching

- The floating switcher (bottom right) toggles between the library themes — `default` and `carbon` — by setting `data-theme` on the app root. Both theme stylesheets are imported in `src/styles.css`.
- The sidebar footer toggles dark/light mode (`data-mode`).
- Both choices persist to `localStorage`; mode falls back to `prefers-color-scheme` until you first toggle it.

## Forms showcase

`/forms` renders LoginForm and RegisterForm side by side: TanStack Form via `useAppForm`, `@ll-ui/react` field wrappers (`form.TextField`, `form.CheckboxField`, a lab-local `form.PasswordField` with a strength meter driven by the zod schema's real minimum length), async submit states, and deterministic mock server failures (`locked@example.com`, `taken@example.com`).

---

## Validation

```bash
pnpm --filter @ll-ui/lab lint
pnpm --filter @ll-ui/lab typecheck
pnpm --filter @ll-ui/lab test
pnpm --filter @ll-ui/lab build
pnpm verify        # from the repo root: library verify + all of the above
```

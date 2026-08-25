# ll-lab Context

Local Vite + React SPA (`@ll-ui/lab`) — the specimen playground for `@ll-ui/react`. TanStack Router, file-based routes, port 4100 (`pnpm dev` from the repo root). Not production code.

---

## Entry points

- `src/main.tsx` — mounts the SPA, imports `src/styles.css`, wires the generated route tree.
- `src/routes/__root.tsx` — root layout: Header, NavSidebar, dark/light mode toggle, floating theme switcher (`default` / `carbon`). Theme + mode persist to `localStorage`.
- `src/nav.config.ts` — sidebar tree. Paths are typed `keyof FileRoutesByTo` (from `src/routeTree.gen.ts`), so stale entries fail typecheck.

## Core systems

### Specimens (library-owned)

Specimens live in `packages/ui/src/**/*.specimen.ts`, colocated with each component, and are re-exported from `@ll-ui/react/specimens`. Each declares `component`, `argTypes` (drives the PropEditor) and `variants`. This app only renders them.

### SpecimenPage + PropEditor

- `src/components/SpecimenPage.tsx` — title/description, variant buttons, live preview wrapped in an error boundary (crashing prop combos show an inline card with "Reset props").
- `src/components/PropEditor.tsx` — auto-generates controls from `argTypes`; lives in the right-hand Props panel provided by `src/routes/components.tsx` via `src/types/prop-editor-context.ts`.

### Forms (`/forms` route)

- `src/form/` — lab-local form layer: `useAppForm` (extends the library's app-form registry with a bound `PasswordField`), `fields/PasswordField.tsx`, `fields/password-strength.ts` (+ test).
- `src/forms/` — demo forms: `LoginForm.tsx`, `RegisterForm.tsx`, `schemas.ts` (zod, exports `MIN_PASSWORD_LENGTH`), tests + shared `test-utils.tsx`.

## Adding a component route

1. Create the specimen in the library and register it in `packages/ui/src/specimens/index.ts`.
2. Add `src/routes/components/<primitives|composed>/<name>.tsx` returning `<SpecimenPage specimen={...} />` (route tree regenerates on dev/build).
3. Add the nav entry in `src/nav.config.ts`.

## Validation

```bash
pnpm --filter @ll-ui/lab lint
pnpm --filter @ll-ui/lab typecheck
pnpm --filter @ll-ui/lab test
pnpm --filter @ll-ui/lab build
```

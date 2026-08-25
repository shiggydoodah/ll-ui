# @ll-ui/react

A theme-agnostic React primitives library + design system. Components read
every visual decision — colour, type, radius, shadows, borders, motion, letter
case — from a `--ui-*` CSS token contract, and a theme is just a small JSON
config compiled to CSS. Slot the same components into any product and any
visual identity.

## Install & setup

Two CSS imports and one attribute:

```css
/* app entry stylesheet */
@import '@ll-ui/react/styles.css'; /* Tailwind + tokens + base (theme-agnostic) */
@import '@ll-ui/react/themes/default'; /* the theme(s) you use — only these cost bytes */
```

```html
<html data-theme="default" data-mode="light"></html>
```

Peer dependencies (the consuming app installs all five): `react ^19`,
`react-dom ^19`, `zod ^4`, `tailwindcss ^4`, `tw-animate-css ^1.4`. See the
repo root `SETUP.md` for the full per-project installation guide (git
dependency, Tailwind `@source`, Next.js notes, why zod is required).

```tsx
import { Button, Card, Input } from '@ll-ui/react';

<Button tone="green" variant="solid">
  Save
</Button>;
```

## Import surfaces

| Subpath                 | Contents                                                       |
| ----------------------- | -------------------------------------------------------------- |
| `@ll-ui/react`          | Root barrel (client-safe only in client components)            |
| `…/primitives`          | Single-element building blocks (Button, Input, Badge, …)       |
| `…/components`          | Composed components (Dialog, Drawer, DropDown, fields, …)      |
| `…/integrations`        | TanStack Form + Table wrappers                                 |
| `…/hooks` `…/providers` | Shared hooks / context providers                               |
| `…/icons`               | `Icon` wrapper + full lucide-react re-export                   |
| `…/types`               | `UiTone`, `UiVariant`, `UiSize`, `UiFontSize`                  |
| `…/specimens`           | Dev-only component preview registry (for ll-lab / theme tools) |
| `…/theme`               | Theme config zod schema + pure CSS generator                   |
| `…/styles.css`          | The shared stylesheet entrypoint                               |
| `…/themes/<name>`       | One theme's CSS (`default`, `carbon`)                          |

Server components must import from the sub-paths, never the top-level barrel
(it re-exports client hooks and TanStack Form).

## Theming

Two themes ship today: `default` (light-first, soft radii, quiet indigo
accent) and `carbon` (dark-first graphite/amber, sharp 2/3/6px radii,
uppercase display text). A theme lives in `themes/<name>/`:

```
themes/carbon/
  theme.json      # hand-written config (the future theme-builder exports this)
  tokens.gen.css  # GENERATED — do not edit
  index.css       # GENERATED entrypoint the app imports
```

`theme.json` is deliberately constrained: **max 12 named palette colours** (the
only place raw hex is allowed — 3- or 6-digit only, no alpha — every colour
role references a palette name or a `color-mix(… {name} …)` expression), **max
3 fonts** (`body`, `display`, `mono`), **3 radii**, **3 shadows**, border
width/style, motion (fast/slow/easing), and display case/tracking. Both
`light` and `dark` modes are required, but only `background`, `foreground`,
`accent` and the six tone hues are mandatory — everything else (borders, text
tiers, input fills, skeleton, tone and accent contrast colours, the modal
overlay) derives automatically, so a hand-written theme stays ~40 lines. See
`themes/default/theme.json` for the minimal shape and
`themes/carbon/theme.json` for a second worked example: `defaultMode: "dark"`,
per-mode accents, hue softening via `color-mix`, and an explicit `overlay`
override.

Two optional mechanisms, neither used by the shipped themes:

- **Custom CSS** — for structural styling the tokens can't express, add a CSS
  file next to `theme.json` (`custom.css` is picked up automatically, or name
  it via the config's optional `custom` field). The generator chains it after
  the tokens in the theme's `index.css`; target the stable `.ui-*` class
  hooks, never component internals.
- **Self-hosted fonts** — give a font in `theme.json` a `files` array of
  `fonts/*.woff2` paths (plus weight/style); the build embeds each file into
  the generated CSS as a data URI, so consumers need zero font configuration.

```bash
pnpm themes:build          # validate + regenerate all themes
pnpm themes:build --check  # CI staleness check (part of `pnpm verify`)
```

### How the pieces fit

1. **`src/styles/tokens.css`** declares the `--ui-*` contract with neutral
   fallbacks — an app with no theme import renders like default-light.
2. **`src/styles.css`** bridges tokens into Tailwind utilities via
   `@theme inline` (`bg-tone-red`, `font-display`, …) so utilities resolve at
   the element that uses them — which is what makes theme islands work.
3. **Generated theme CSS** scopes token values under `[data-theme='<name>']`
   with `[data-mode]` blocks for light/dark. No `:root` rules — a theme applies
   only where you put its attribute:
   - whole app: `<html data-theme="carbon" data-mode="dark">`
   - theme island: `<section data-theme="carbon">` inherits the page's mode
   - mode island: `<div data-mode="light">` inside a themed subtree
4. **Custom theme CSS** (when a theme declares one) chains after the tokens
   for structural styling — think press-into-shadow buttons or hard-edged
   panels — by targeting the stable class hooks (`.ui-btn`, `.ui-field`,
   `.ui-card`, `.ui-dialog`, `.ui-badge`, `.ui-display-text`, …). Components
   never change per theme.

### The focus ring

The animated conic focus ring is the library default and is fully
token-coloured (`--ui-focus-ring`, `--ui-focus-ring-background`) — most themes
just recolor it. A theme wanting a different mechanism entirely (a hard
outline, say) overrides it in its custom CSS.

## Icons

Use the shared `Icon` wrapper for consistent sizing and accessibility defaults.
Import Lucide symbols from `@ll-ui/react/icons`.

```tsx
import { Icon } from '@ll-ui/react';
import { AlertTriangle, Search } from '@ll-ui/react/icons';

<Icon icon={Search} />
<Icon icon={AlertTriangle} decorative={false} label="Warning" />
```

## Development

- `COMPONENTS.md` — catalog of every export (what to compose).
- `CONTEXT.md` — authoring guide (how to add/change components).
- `pnpm --filter @ll-ui/react verify` — lint, typecheck, theme staleness,
  CSS export/purity/guardrail checks, component catalog.
- `pnpm dev` (repo root) — ll-lab playground with a live theme × mode switcher.

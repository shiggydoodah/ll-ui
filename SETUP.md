# Using @ll-ui/react in a project (pre-publish)

The package is source-shipped: exports point at TypeScript source and your
app's bundler compiles it. This matches how it is consumed inside this repo
and avoids a build pipeline until the library is published to npm.

## 1. Install

Primary path — pnpm git dependency (pin a commit for reproducible installs):

```bash
pnpm add "github:shiggydoodah/ll-ui#<commit-sha>&path:/packages/ui"
# tracking the default branch instead:
pnpm add "github:shiggydoodah/ll-ui#path:/packages/ui"
```

It installs under its manifest name, `@ll-ui/react`. Also install the peers —
all five are required:

```bash
pnpm add react@^19 react-dom@^19 zod@^4 tailwindcss@^4 tw-animate-css@^1.4
```

`tailwindcss` and `tw-animate-css` are peers because `styles.css` `@import`s
them and your app owns the CSS build. `zod` is a required peer even if you
never touch the form APIs: the package ships TypeScript source and the form
integration type-imports zod, so any root-barrel consumer's typecheck needs it
resolvable.

Local development alternatives:

```bash
pnpm add "file:../ll-ui/packages/ui"   # local checkout
# or, inside this repo's workspace:  "@ll-ui/react": "workspace:*"
```

## 2. CSS

In your app's entry stylesheet:

```css
@import '@ll-ui/react/styles.css'; /* Tailwind + token contract + base styles */
@import '@ll-ui/react/themes/default'; /* each theme you actually use: default, carbon */

@source '.'; /* your app's own classes */
@source '../node_modules/@ll-ui/react/src'; /* the library's classes */
```

The second `@source` line matters for real (non-workspace) installs: Tailwind
v4 skips `node_modules` during auto-detection, so point it at the package
source explicitly (adjust the relative path to your stylesheet's location).
Workspace/`file:` installs that symlink the package usually work without it,
but the explicit line is harmless and portable.

## 3. Activate a theme

Set two attributes on `<html>` (or any subtree root):

```html
<html data-theme="default" data-mode="light"></html>
```

- Two themes ship today: `default` and `carbon`. Multiple themes can be
  imported side by side; only imported themes cost bytes.
- Theme islands: `<section data-theme="carbon">` re-skins a subtree and
  inherits the page's mode; `<div data-mode="dark">` flips mode for a subtree.
- Mode switching is yours to own (one attribute swap — persist it however the
  app prefers).

## 4. Framework notes

**Next.js** — the package ships raw TS, so add it to `transpilePackages`:

```ts
// next.config.ts
const nextConfig = { transpilePackages: ['@ll-ui/react'] };
```

Use `@tailwindcss/postcss` per Tailwind v4 docs. Server components must import
from sub-paths (`@ll-ui/react/primitives`, `…/components`) — the root barrel
re-exports client hooks and is not RSC-safe.

**Vite** — works out of the box with `@tailwindcss/vite`. Add
`resolve.dedupe: ['react', 'react-dom']` if you link the package locally.

## 5. Custom theme for your project

1. Copy a shipped theme into the library checkout as
   `themes/<yourname>/theme.json` and edit — `themes/default/theme.json` is the
   minimal light-first shape, `themes/carbon/theme.json` the dark-first one with
   more overrides. Constraints: ≤12 palette colours (3- or 6-digit hex only, no
   alpha), 3 fonts, 3 radii, 3 shadows, border, motion, display.
2. Run `pnpm themes:build` in `packages/ui` — validates against the zod schema
   and generates the CSS.
3. Import `@ll-ui/react/themes/<yourname>` and set `data-theme="<yourname>"`.

For structural styling beyond tokens, add a CSS file next to `theme.json` —
`custom.css` is picked up automatically, or name it via the config's optional
`custom` field — targeting the stable `.ui-*` hooks (`.ui-btn`, `.ui-card`,
`.ui-dialog`, …). The generator chains it after the tokens in the theme's
`index.css`. Neither shipped theme needs one, so there is no example in the
repo — the tokens cover both of them entirely.

Today themes live inside the package (you are the maintainer); the roadmap is
config-in-consumer-repo + a theme-builder site exporting the same JSON.

## Troubleshooting

- **Components render unstyled** — check both `@source` lines and that
  `styles.css` is imported before the theme.
- **Theme not applying** — is `data-theme` set on an ancestor of the content?
  Themes never style `:root`.
- **Fonts not loading** — the shipped themes use system font stacks, so they
  never fetch font files. A custom theme can self-host fonts via `fonts.files`
  in `theme.json`; the build embeds the woff2 files into the generated CSS as
  data URIs, so if you see fallback fonts, the theme CSS import itself is
  missing.
- **TypeScript errors inside the package source** — your `tsconfig` needs
  `"moduleResolution": "bundler"` (or `node16`+) so the `exports` map resolves,
  and `strict` mode parity helps.

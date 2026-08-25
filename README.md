# LL-UI

This is my personal component library — the UI and design system I use across my React/TypeScript projects. Everything is built on a token-based theming system, so the same components drop into any app and take on any visual identity by swapping a small theme config.

It's designed as the primitive building blocks for an app — install it into a single frontend repo or drop the package into a monorepo workspace and build your product's components on top.

It's a work in progress. I'm building it out gradually as I need things in real projects, which means the components that exist are ones that have actually been used, not filler.

> [!WARNING]
> This is pre-release. APIs, tokens and component names can still change between commits, and there's no npm package yet — it installs as a git dependency. Pin a commit if you use it.

> [!NOTE]
> **Where to look:** the polished work is the component library in [`packages/ui/src/ui`](./packages/ui/src/ui) — that's what's carefully built and what you should read first. The ll-lab playground in `apps/ui-lab` is very early WIP and needs a lot of love and attention, so judge the library by the package, not by the lab.

## Components

**Primitives** — single-element building blocks:

Avatar, Badge, Bars, Box, Button, Card, Checkbox, CheckboxButton, CountBadge, Divider, Grid, Icon, Input, List, LoadingDots, ProgressBar, Radio, RadioCard, Row / Stack, Select, Skeleton, Slider, Spinner, StatusDot, Switch, Table, Textarea, ToggleSwitch, Typography (Text, Heading, Display), VerifiedBadge

**Components** — composed pieces:

Accordion, ActionModal, AvatarCrop, Banner, Callout, Dialog, Drawer, DropDown, Fields, FileUpload, HoverCard, MessageBubble, MetricInput, PasswordStrengthMeter, Popover, ScrollArea, Tabs, Toast, Tooltip

**Integrations** — DataTable (TanStack Table) and Form (TanStack Form) wrappers.

**Hooks & providers** — `useCountdown`, `useDebouncedAsync`, `useFileUpload`, `useMediaQuery`, plus a notification provider.

## How the design system works

Components never hard-code visual decisions. Colour, type, radius, shadows, borders, motion and even letter casing all come from a `--ui-*` CSS token contract. A theme is just a small JSON config (up to 12 colours, 3 fonts, 3 radii, 3 shadows) compiled to CSS, and you switch theme and mode with two attributes:

```html
<html data-theme="default" data-mode="dark"></html>
```

Two themes ship today: `default` (light-first, soft radii, quiet indigo accent) and `carbon` (dark-first graphite with an amber accent, sharp radii, uppercase display text). Same components, two very different identities — that contrast is the point.

On top of that, components share a consistent `tone` / `variant` / `size` prop API, so `<Button tone="green" variant="outline">` looks right under any theme. The point is portability: I can move between projects with completely different branding and keep the same component code.

## Specimens & ll-lab

Components ship with a colocated `.specimen` file — a small definition of the prop surface and showcase variants, a bit like a lightweight Storybook story without the tooling. The specimen registry powers two things:

- **ll-lab** (package `@ll-ui/lab`, folder `apps/ui-lab`) — a Vite playground that renders every specimen with a live switcher for the shipped themes and light/dark mode, prop controls included
- a render test that mounts every specimen, so every component gets a smoke test for free

A verify check makes sure no new component ships without a specimen (a handful of early components are explicitly grandfathered).

**ll-lab is very early WIP.** It's a scratch harness I threw together to look at components while building them, and it needs a lot of love and attention — rough layout, patchy prop controls and plenty of unfinished edges. Don't judge the library by it. The component library itself lives in [`packages/ui/src/ui`](./packages/ui/src/ui) (`primitives`, `components`, `integrations`, `hooks`, `providers`, `icons`) and that's the part that's polished and worth reading.

## Running it locally

```bash
# Node 24 — see .nvmrc
pnpm install
pnpm dev       # ll-lab on http://localhost:4100
pnpm verify    # lint, typecheck, tests, theme/CSS/catalog checks
```

Toolchain note: the repo pins two TypeScript compilers on purpose — `typescript` is aliased to `@typescript/typescript6` (the JS compiler, picked up by editors and any tooling that resolves the `typescript` package) while `@typescript/native` provides the native `tsc` CLI that the typecheck scripts actually run.

## Works with

- React 19 / React DOM 19 (peer dependencies)
- TypeScript — the package is source-shipped, your bundler compiles it
- Tailwind CSS v4 + tw-animate-css — peer dependencies; your app installs them and owns the CSS build
- Zod 4 — peer dependency (theme schema and form integration)
- Radix UI under the hood for the tricky interactive parts

Instructions for installing it in your own app are in [SETUP.md](./SETUP.md).

## Contributing

This is a personal library, so I'm not chasing contributions — but issues, questions and ideas are genuinely welcome. If you want to send a PR, open an issue first so we can agree the direction before you write code. The short version of the rules is in [CONTRIBUTING.md](./CONTRIBUTING.md).

## What's next

- More components
- A proper npm package (build pipeline, published releases)
- Support for older and newer React versions
- A React Native version of the library

# Contributing

ll-ui is a personal library — I build it to serve my own projects, and its
direction follows what those projects need. That said:

- **Issues are welcome.** Bug reports, questions and ideas are all useful,
  however small.
- **PRs by prior discussion.** Open an issue first so we can agree the
  direction before you write code — unsolicited large PRs will probably be
  declined regardless of quality.

## The gate

```bash
# Node 24 — see .nvmrc
pnpm install
pnpm verify      # lint, typecheck, tests, theme/CSS/catalog checks — must pass
```

`pnpm install` also installs the Husky hooks: pre-commit formats and re-stages
your staged files, and pre-push blocks direct pushes to `main` unless every
changed path is under `docs/` — branch and open a PR instead.

New components must ship with a colocated `.specimen` file — the catalog check
inside `verify` fails without one. The authoring rules live in
`packages/ui/CONTEXT.md`; the component index in `packages/ui/COMPONENTS.md`.

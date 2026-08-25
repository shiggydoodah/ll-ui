# AGENTS.md

Working notes for coding agents in this repo. Human-facing docs live in
`README.md`, `SETUP.md` and `CONTRIBUTING.md`.

## The gate

```bash
# Node 24 — see .nvmrc
pnpm install
pnpm verify      # lint, typecheck, tests, theme/CSS/catalog checks — must pass
```

New components need a colocated `.specimen` file or the catalog check inside
`verify` fails. Authoring rules: `packages/ui/CONTEXT.md`. Component index:
`packages/ui/COMPONENTS.md`.

## Git hooks

`pnpm install` wires up Husky via the root `prepare` script:

- **pre-commit** runs `scripts/format-staged.sh` — Prettier over the staged
  `ts`, `tsx`, `js`, `mjs`, `cjs`, `json`, `md`, `css`, `yml`, `yaml` and `html`
  files, re-staged before the commit lands. Expect what gets committed to be the
  formatted version of what you wrote.
- **pre-push** blocks direct pushes to `main`/`master` unless every changed path
  is under `docs/`. Push a branch and open a PR instead; `--no-verify` is an
  emergency bypass, not a workflow.

## Changelog

**Do not update `CHANGELOG.md`.** ll-ui is not released — there is no npm
package and no consumers, so there is nothing for a changelog entry to be
useful to. Until the repo goes public and the first version ships, the commit
history is the record. Skip the changelog unless explicitly asked.

When the first release lands, drop this section and start keeping
`CHANGELOG.md` properly from that version onward.

/*
 * Design-kit exporter. Renders every specimen (all variants, light + dark)
 * to a self-contained static HTML card per theme, plus per-theme foundations
 * pages, into .design-kit/ — ready to push to a Claude Design project.
 *
 *   pnpm kit:build
 *
 * Each page inlines the compiled Tailwind CSS and the theme CSS (fonts are
 * already embedded as data URIs by the theme generator), so it renders with
 * zero external requests. The first line of each page is a @dsCard comment —
 * the Design System pane builds its card index from it.
 */
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { JSDOM } from 'jsdom';

// Type-only/pure module (no React runtime, no side effects), so a static import
// is safe ahead of the jsdom globals below.
import { defaultRenderProps } from '../src/specimens/define';

const packageRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const outRoot = path.join(packageRoot, '.design-kit');
const themesRoot = path.join(packageRoot, 'themes');
const uiRoot = path.join(packageRoot, 'src', 'ui');

// --- jsdom globals (mirror specimens.render.test.tsx) — must exist before the
// component modules are imported, so all specimen imports stay dynamic.
const dom = new JSDOM('<!doctype html><html><body></body></html>');
const globals: Record<string, unknown> = {
  window: dom.window,
  document: dom.window.document,
  navigator: dom.window.navigator,
  HTMLElement: dom.window.HTMLElement,
  Element: dom.window.Element,
  Node: dom.window.Node,
  getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
  requestAnimationFrame: (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0),
  cancelAnimationFrame: (id: number) => clearTimeout(id),
  matchMedia:
    dom.window.matchMedia ??
    (() => ({ matches: false, addEventListener() {}, removeEventListener() {} })),
  ResizeObserver: class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
};
for (const [key, value] of Object.entries(globals)) {
  Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
}
dom.window.Element.prototype.scrollIntoView = () => {};

type Specimen = {
  title: string;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  argTypes: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variants: { name: string; props: Record<string, any> }[];
};

const esc = (s: string) =>
  s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// --- discover specimen modules, keyed by category (primitives/components/…)
const findSpecimenFiles = async (dir: string): Promise<string[]> => {
  const out: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await findSpecimenFiles(full)));
    else if (/\.specimen\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
};

const main = async () => {
  // 1. Compile the package CSS once (utilities for every component + specimen).
  await rm(outRoot, { recursive: true, force: true });
  await mkdir(outRoot, { recursive: true });
  console.log('Compiling Tailwind CSS…');
  execSync('pnpm exec tailwindcss -i src/styles.css -o .design-kit/base.css --minify', {
    cwd: packageRoot,
    stdio: 'inherit',
  });
  const baseCss = await readFile(path.join(outRoot, 'base.css'), 'utf8');

  // 2. Load themes (tokens.gen.css already inlines fonts as data URIs).
  const themes: { name: string; css: string; config: ThemeJson }[] = [];
  for (const entry of await readdir(themesRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const dir = path.join(themesRoot, entry.name);
    const configPath = path.join(dir, 'theme.json');
    if (!existsSync(configPath)) continue;
    let css = await readFile(path.join(dir, 'tokens.gen.css'), 'utf8');
    const customPath = path.join(dir, 'custom.css');
    if (existsSync(customPath)) css += '\n' + (await readFile(customPath, 'utf8'));
    themes.push({ name: entry.name, css, config: JSON.parse(await readFile(configPath, 'utf8')) });
  }

  // 3. Import specimens (after jsdom globals) and render every variant.
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { createElement } = await import('react');

  const specimens: { category: string; slug: string; specimen: Specimen }[] = [];
  for (const file of await findSpecimenFiles(uiRoot)) {
    const category = path.relative(uiRoot, file).split(path.sep)[0] ?? 'components';
    const slug = path.basename(file).replace(/\.specimen\.tsx?$/, '');
    const mod = (await import(pathToFileURL(file).href)) as Record<string, unknown>;
    for (const value of Object.values(mod)) {
      const s = value as Specimen;
      if (s && typeof s === 'object' && 'title' in s && 'component' in s && 'variants' in s) {
        specimens.push({ category, slug, specimen: s });
      }
    }
  }
  specimens.sort((a, b) => a.category.localeCompare(b.category) || a.slug.localeCompare(b.slug));
  console.log(`Rendering ${specimens.length} specimens × ${themes.length} themes…`);

  const failures: string[] = [];
  let pages = 0;

  for (const theme of themes) {
    const themeLabel = titleCase(theme.name);
    for (const { category, slug, specimen } of specimens) {
      const defaultProps = defaultRenderProps(specimen);
      const variants = specimen.variants.length
        ? specimen.variants
        : [{ name: 'Default', props: {} }];

      const cells = variants
        .map((variant) => {
          try {
            const html = renderToStaticMarkup(
              createElement(specimen.component, {
                ...defaultProps,
                ...variant.props,
              }),
            );
            return `<div class="cell"><div class="cell-label">${esc(variant.name)}</div><div class="cell-body">${html}</div></div>`;
          } catch (error) {
            failures.push(`${theme.name}/${slug} · ${variant.name}: ${String(error)}`);
            return '';
          }
        })
        .join('\n');

      const pane = (mode: string) =>
        `<section class="pane" data-theme="${theme.name}" data-mode="${mode}"><div class="pane-label">${mode}</div><div class="grid">${cells}</div></section>`;

      const subtitle = specimen.variants
        .map((v) => v.name)
        .join(' / ')
        .slice(0, 120);
      const buildPage = (name: string, body: string) =>
        [
          `<!-- @dsCard group="${esc(themeLabel)} · ${esc(titleCase(category))}" name="${esc(name)}" subtitle="${esc(subtitle)}" width="960" -->`,
          '<!doctype html>',
          `<html><head><meta charset="utf-8"><title>${esc(name)} — ${esc(themeLabel)}</title>`,
          `<style>${baseCss}</style><style>${theme.css}</style><style>${chromeCss}</style></head>`,
          `<body>${body}</body></html>`,
        ].join('\n');

      const outDir = path.join(outRoot, theme.name, category);
      await mkdir(outDir, { recursive: true });
      const page = buildPage(specimen.title, pane('light') + pane('dark'));
      // DesignSync caps files at 256 KiB — split oversized pages per mode.
      if (Buffer.byteLength(page) > 250_000) {
        for (const mode of ['light', 'dark']) {
          await writeFile(
            path.join(outDir, `${slug}-${mode}.html`),
            buildPage(`${specimen.title} (${mode})`, pane(mode)),
          );
          pages += 1;
        }
      } else {
        await writeFile(path.join(outDir, `${slug}.html`), page);
        pages += 1;
      }
    }

    // 4. Foundations pages, generated from theme.json + live token vars.
    const outDir = path.join(outRoot, theme.name, 'foundations');
    await mkdir(outDir, { recursive: true });
    await writeFile(
      path.join(outDir, 'colors.html'),
      foundationsColorsPage(theme.name, themeLabel, theme.config, baseCss, theme.css),
    );
    await writeFile(
      path.join(outDir, 'type-and-shape.html'),
      foundationsShapePage(theme.name, themeLabel, theme.config, baseCss, theme.css),
    );
    pages += 2;
  }

  console.log(`✓ ${pages} pages written to ${path.relative(process.cwd(), outRoot)}`);
  if (failures.length) {
    console.error(`✗ ${failures.length} variant(s) failed to render:`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exitCode = 1;
  }
};

type ThemeJson = {
  palette: Record<string, string>;
  fonts?: Record<string, { family?: string; alias?: string }>;
  radius?: Record<string, string>;
  shadows?: Record<string, string>;
};

const chromeCss = `
  html, body { margin: 0; padding: 0; }
  .pane { padding: 24px 28px 32px; background: var(--ui-background); color: var(--ui-foreground); font-family: var(--ui-font-body); }
  .pane-label, .cell-label, .swatch-label { font-family: var(--ui-font-mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ui-text-subtle); }
  .pane-label { margin-bottom: 16px; }
  .grid { display: flex; flex-wrap: wrap; gap: 28px; align-items: flex-start; }
  .cell { display: flex; flex-direction: column; gap: 8px; min-width: 0; max-width: 100%; }
  .cell-body { min-width: 0; }
  .swatch-row { display: flex; flex-wrap: wrap; gap: 12px; }
  .swatch { width: 108px; display: flex; flex-direction: column; gap: 6px; }
  .swatch-chip { height: 56px; border-radius: var(--ui-radius-md); border: 1px solid var(--ui-border); }
  .section { margin-bottom: 28px; }
  .section-title { font-family: var(--ui-font-display); font-size: 15px; font-weight: 600; margin: 0 0 12px; text-transform: var(--ui-display-case); letter-spacing: var(--ui-display-tracking); }
`;

const foundationsShell = (
  title: string,
  themeName: string,
  themeLabel: string,
  baseCss: string,
  themeCss: string,
  subtitle: string,
  body: (mode: string) => string,
) =>
  [
    `<!-- @dsCard group="${esc(themeLabel)} · Foundations" name="${esc(title)}" subtitle="${esc(subtitle)}" width="960" -->`,
    '<!doctype html>',
    `<html><head><meta charset="utf-8"><title>${esc(title)} — ${esc(themeLabel)}</title>`,
    `<style>${baseCss}</style><style>${themeCss}</style><style>${chromeCss}</style></head>`,
    `<body>${['light', 'dark']
      .map(
        (mode) =>
          `<section class="pane" data-theme="${themeName}" data-mode="${mode}"><div class="pane-label">${mode}</div>${body(mode)}</section>`,
      )
      .join('')}</body></html>`,
  ].join('\n');

const foundationsColorsPage = (
  themeName: string,
  themeLabel: string,
  config: ThemeJson,
  baseCss: string,
  themeCss: string,
) => {
  const palette = Object.entries(config.palette ?? {})
    .map(
      ([name, value]) =>
        `<div class="swatch"><div class="swatch-chip" style="background:${esc(value)}"></div><div class="swatch-label">${esc(name)}<br>${esc(value)}</div></div>`,
    )
    .join('');
  const semantic = [
    'background',
    'background-subtle',
    'background-muted',
    'foreground',
    'accent',
    'accent-hover',
    'border',
    'border-strong',
    'text-subtle',
    'text-muted',
    'input-background',
    'focus-ring',
  ]
    .map(
      (t) =>
        `<div class="swatch"><div class="swatch-chip" style="background:var(--ui-${t})"></div><div class="swatch-label">--ui-${t}</div></div>`,
    )
    .join('');
  const tones = ['red', 'green', 'amber', 'blue', 'purple', 'magenta']
    .map(
      (t) =>
        `<div class="swatch"><div class="swatch-chip" style="background:var(--ui-tone-${t});display:flex;align-items:center;justify-content:center;color:var(--ui-tone-${t}-contrast);font-family:var(--ui-font-mono);font-size:12px">Aa</div><div class="swatch-label">${t}</div></div>`,
    )
    .join('');
  const body = () =>
    `<div class="section"><h2 class="section-title">Palette</h2><div class="swatch-row">${palette}</div></div>` +
    `<div class="section"><h2 class="section-title">Semantic</h2><div class="swatch-row">${semantic}</div></div>` +
    `<div class="section"><h2 class="section-title">Tones</h2><div class="swatch-row">${tones}</div></div>`;
  return foundationsShell(
    'Colors',
    themeName,
    themeLabel,
    baseCss,
    themeCss,
    'Palette / semantic tokens / tones',
    body,
  );
};

const foundationsShapePage = (
  themeName: string,
  themeLabel: string,
  config: ThemeJson,
  baseCss: string,
  themeCss: string,
) => {
  const fontLabel = (role: string) => {
    const font = config.fonts?.[role];
    if (!font) return 'system';
    return font.family ?? `alias of ${font.alias ?? 'body'}`;
  };
  const type =
    `<div style="font-family:var(--ui-font-display);font-size:32px;font-weight:700;text-transform:var(--ui-display-case);letter-spacing:var(--ui-display-tracking)">Display — ${esc(fontLabel('display'))}</div>` +
    `<p style="font-family:var(--ui-font-body);font-size:15px;max-width:52ch">Body — ${esc(fontLabel('body'))}. The quick brown fox jumps over the lazy dog, 0123456789.</p>` +
    `<code style="font-family:var(--ui-font-mono);font-size:13px">mono — ${esc(fontLabel('mono'))} · const answer = 42;</code>`;
  const boxes = (kind: 'radius' | 'shadow') =>
    ['sm', 'md', 'lg']
      .map(
        (size) =>
          `<div class="swatch"><div class="swatch-chip" style="background:var(--ui-background-subtle);${
            kind === 'radius'
              ? `border-radius:var(--ui-radius-${size})`
              : `box-shadow:var(--ui-shadow-${size});border:none`
          }"></div><div class="swatch-label">${kind}-${size}</div></div>`,
      )
      .join('');
  const border = `<div class="swatch"><div class="swatch-chip" style="border:var(--ui-border-width) var(--ui-border-style) var(--ui-border-strong);background:var(--ui-background)"></div><div class="swatch-label">border</div></div>`;
  const motion = `<div class="swatch-label">motion: fast var(--ui-motion-fast) · slow var(--ui-motion-slow)</div>`;
  const body = () =>
    `<div class="section"><h2 class="section-title">Type</h2>${type}</div>` +
    `<div class="section"><h2 class="section-title">Radius</h2><div class="swatch-row">${boxes('radius')}</div></div>` +
    `<div class="section"><h2 class="section-title">Shadow</h2><div class="swatch-row">${boxes('shadow')}</div></div>` +
    `<div class="section"><h2 class="section-title">Border & motion</h2><div class="swatch-row">${border}</div>${motion}</div>`;
  return foundationsShell(
    'Type & shape',
    themeName,
    themeLabel,
    baseCss,
    themeCss,
    'Fonts / radius / shadow / border / motion',
    body,
  );
};

await main();

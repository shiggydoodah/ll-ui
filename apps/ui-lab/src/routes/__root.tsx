import { createRootRoute, Outlet } from '@tanstack/react-router';
import { useMediaQuery } from '@ll-ui/react';
import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { NavSidebar } from '../components/layout/NavSidebar';

const THEMES = ['default', 'carbon'] as const;
type ThemeName = (typeof THEMES)[number];
type Mode = 'dark' | 'light';

const THEME_STORAGE_KEY = 'ui-lab-theme';
const MODE_STORAGE_KEY = 'ui-lab-mode';

// Client-only Vite app, so window/localStorage are always available — no SSR guards.
const readInitialTheme = (): ThemeName => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return (THEMES as readonly string[]).includes(stored ?? '') ? (stored as ThemeName) : 'default';
};

/** `null` = no manual choice yet, so the OS preference still drives the mode. */
const readStoredMode = (): Mode | null => {
  const stored = localStorage.getItem(MODE_STORAGE_KEY);
  return stored === 'dark' || stored === 'light' ? stored : null;
};

/** Floating switcher — the lab's theme QA surface. */
const ThemeSwitcher = ({
  theme,
  onThemeChange,
}: {
  theme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}) => (
  <div className="fixed right-4 bottom-4 z-50 flex gap-1 rounded-(--ui-radius-md) border-(length:--ui-border-width) border-(--ui-border-strong) bg-(--ui-background-subtle) p-1 shadow-(--ui-shadow-md)">
    {THEMES.map((name) => (
      <button
        key={name}
        type="button"
        onClick={() => onThemeChange(name)}
        className={`ui-display-text text-2xs cursor-pointer rounded-(--ui-radius-sm) px-2 py-1 font-bold transition ${
          name === theme
            ? 'bg-(--ui-accent) text-(--ui-background)'
            : 'text-(--ui-text-subtle) hover:text-(--ui-foreground)'
        }`}
      >
        {name}
      </button>
    ))}
  </div>
);

const RootLayout = () => {
  const [storedMode, setStoredMode] = useState<Mode | null>(readStoredMode);
  const [theme, setTheme] = useState<ThemeName>(readInitialTheme);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // `useMediaQuery` subscribes rather than sampling once, so with no stored
  // choice the lab follows OS theme flips mid-session.
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const mode: Mode = storedMode ?? (prefersDark ? 'dark' : 'light');

  // Persist in the change handlers (not an effect) so a write only ever happens
  // on an explicit user choice — that is what makes the prefers-color-scheme
  // fallback stay live until the first manual toggle.
  const changeTheme = (next: ThemeName) => {
    localStorage.setItem(THEME_STORAGE_KEY, next);
    setTheme(next);
  };

  const toggleMode = () => {
    const next: Mode = mode === 'dark' ? 'light' : 'dark';
    localStorage.setItem(MODE_STORAGE_KEY, next);
    setStoredMode(next);
  };

  return (
    <div
      data-theme={theme}
      data-mode={mode}
      className="flex h-dvh flex-col bg-(--ui-background) text-(--ui-foreground)"
    >
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((o) => !o)} />
      <div className="flex min-h-0 flex-1">
        <NavSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          mode={mode}
          onModeToggle={toggleMode}
        />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      <ThemeSwitcher theme={theme} onThemeChange={changeTheme} />
    </div>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
});

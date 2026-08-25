import { Link, useRouterState } from '@tanstack/react-router';
import { Sun, Moon } from '@ll-ui/react/icons';
import { cn } from '@ll-ui/react';
import { nav, type NavItem } from '../../nav.config';

interface NavSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'dark' | 'light';
  onModeToggle: () => void;
}

const NavLink = ({ item, onClose }: { item: NavItem; onClose: () => void }) => {
  const { location } = useRouterState();
  const isActive =
    item.path === '/'
      ? location.pathname === '/'
      : location.pathname === item.path || location.pathname.startsWith(item.path + '/');

  return (
    <li>
      <Link
        to={item.path}
        onClick={onClose}
        className={cn(
          'block rounded px-3 py-2 text-sm transition-colors',
          isActive
            ? 'bg-(--ui-accent)/10 font-medium text-(--ui-foreground)'
            : 'text-(--ui-text-subtle) hover:bg-(--ui-border)/60 hover:text-(--ui-foreground)',
        )}
      >
        {item.label}
      </Link>
      {item.children && item.children.length > 0 && (
        <ul className="mt-0.5 ml-3 space-y-0.5 border-l border-(--ui-border) pl-3">
          {item.children.map((child) => (
            <NavLink key={child.path} item={child} onClose={onClose} />
          ))}
        </ul>
      )}
    </li>
  );
};

export const NavSidebar = ({ isOpen, onClose, mode, onModeToggle }: NavSidebarProps) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed top-16 bottom-0 left-0 z-30 flex w-60 flex-col',
          'border-r border-(--ui-border) bg-(--ui-background)',
          'transition-transform duration-200',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'md:static md:top-auto md:bottom-auto md:translate-x-0 md:transition-none',
        )}
      >
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-0.5">
            {nav.map((item) => (
              <NavLink key={item.path} item={item} onClose={onClose} />
            ))}
          </ul>
        </nav>

        <div className="border-t border-(--ui-border) p-3">
          <button
            type="button"
            onClick={onModeToggle}
            className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-(--ui-text-subtle) transition-colors hover:bg-(--ui-border)/60 hover:text-(--ui-foreground)"
            aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
          >
            {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span>{mode === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

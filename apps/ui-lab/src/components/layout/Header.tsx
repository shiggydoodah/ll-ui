import { useLocation } from '@tanstack/react-router';
import { Menu, X } from '@ll-ui/react/icons';

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

// Route paths are kebab-case ("count-badge"), so title-case each hyphen
// segment individually — "Count Badge", not "Count-badge".
const titleCaseSegment = (segment: string): string =>
  segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const formatPathTitle = (pathname: string): string => {
  if (pathname === '/') return 'Home';
  return pathname.split('/').filter(Boolean).map(titleCaseSegment).join(' › ');
};

export const Header = ({ sidebarOpen, onToggleSidebar }: HeaderProps) => {
  const { pathname } = useLocation();

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-(--ui-border) bg-(--ui-background) px-4">
      <button
        type="button"
        onClick={onToggleSidebar}
        className="flex h-9 w-9 items-center justify-center rounded border border-(--ui-border) text-(--ui-foreground) hover:border-(--ui-border-hover) md:hidden"
        aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
      >
        {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
      </button>
      <div className="flex items-baseline gap-2">
        <span className="font-bold tracking-tight text-(--ui-foreground)">UI Lab</span>
        <span className="text-(--ui-text-subtle)">/</span>
        <span className="text-sm text-(--ui-text-subtle)">{formatPathTitle(pathname)}</span>
      </div>
    </header>
  );
};

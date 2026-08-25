import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

type DeviceSize = 'mobile' | 'tablet' | 'desktop';
type GridSize = 'sm' | 'md' | 'lg';

const deviceLabel: Record<DeviceSize, string> = {
  mobile: 'Mobile 375px',
  tablet: 'Tablet 768px',
  desktop: 'Desktop',
};

const deviceMaxWidth: Record<DeviceSize, string> = {
  mobile: 'max-w-[375px]',
  tablet: 'max-w-[768px]',
  desktop: 'max-w-full',
};

const gridSizePx: Record<GridSize, string> = {
  sm: '16px',
  md: '24px',
  lg: '40px',
};

const PlaygroundColumn = ({
  mode,
  gridEnabled,
  gridSize,
  deviceSize,
}: {
  mode: 'dark' | 'light';
  gridEnabled: boolean;
  gridSize: GridSize;
  deviceSize: DeviceSize;
}) => {
  const size = gridSizePx[gridSize];
  const gridStyle: React.CSSProperties = gridEnabled
    ? {
        backgroundImage:
          'linear-gradient(var(--ui-border) 1px, transparent 1px), linear-gradient(90deg, var(--ui-border) 1px, transparent 1px)',
        backgroundSize: `${size} ${size}`,
      }
    : {};

  return (
    <div
      data-mode={mode}
      className="flex flex-1 flex-col overflow-auto bg-(--ui-background)"
      style={gridStyle}
    >
      <div
        className={`mx-auto w-full ${deviceMaxWidth[deviceSize]} flex flex-col items-center gap-4 p-8 text-center`}
      >
        <h1>
          Welcome <em>back</em>
        </h1>
        <p>
          Sign in to pick up where you left off — <em>Body text</em> used for first paragraphs.
        </p>
        <p className="text-(--ui-text-subtle)">
          Sign in to pick up where you left off — <em>Body text</em> used for first paragraphs.
        </p>
        <p className="text-(--ui-text-muted)">
          Sign in to pick up where you left off — <em>Body text</em> used for first paragraphs.
        </p>
        <span>
          Sign in to pick up where you left off — <em>Body text</em> used for first paragraphs.
        </span>
        <span className="text-(--ui-text-subtle)">
          Sign in to pick up where you left off — <em>Body text</em> used for first paragraphs.
        </span>
        <span className="text-(--ui-text-muted)">
          Sign in to pick up where you left off — <em>Body text</em> used for first paragraphs.
        </span>
      </div>
    </div>
  );
};

const Playground = () => {
  const [deviceSize, setDeviceSize] = useState<DeviceSize>('desktop');
  const [gridEnabled, setGridEnabled] = useState(false);
  const [gridSize, setGridSize] = useState<GridSize>('md');

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-3 border-b border-(--ui-border) bg-(--ui-background) px-4 py-2">
        <div className="flex items-center gap-1">
          {(['mobile', 'tablet', 'desktop'] as DeviceSize[]).map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setDeviceSize(size)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                deviceSize === size
                  ? 'bg-(--ui-accent) text-white'
                  : 'text-(--ui-text-subtle) hover:text-(--ui-foreground)'
              }`}
            >
              {deviceLabel[size]}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-(--ui-border)" />

        <button
          type="button"
          onClick={() => setGridEnabled((g) => !g)}
          className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
            gridEnabled
              ? 'bg-(--ui-accent) text-white'
              : 'text-(--ui-text-subtle) hover:text-(--ui-foreground)'
          }`}
        >
          Grid
        </button>

        {gridEnabled && (
          <div className="flex items-center gap-1">
            {(['sm', 'md', 'lg'] as GridSize[]).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setGridSize(size)}
                className={`rounded px-2.5 py-1 text-xs font-medium uppercase transition-colors ${
                  gridSize === size
                    ? 'bg-(--ui-border-strong) text-(--ui-foreground)'
                    : 'text-(--ui-text-subtle) hover:text-(--ui-foreground)'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex min-h-0 flex-1">
        <PlaygroundColumn
          mode="dark"
          gridEnabled={gridEnabled}
          gridSize={gridSize}
          deviceSize={deviceSize}
        />
        <div className="w-px shrink-0 bg-(--ui-border)" />
        <PlaygroundColumn
          mode="light"
          gridEnabled={gridEnabled}
          gridSize={gridSize}
          deviceSize={deviceSize}
        />
      </div>
    </div>
  );
};

export const Route = createFileRoute('/playground')({
  component: Playground,
});

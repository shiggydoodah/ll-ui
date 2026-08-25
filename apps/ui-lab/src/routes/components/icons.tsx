import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/components/icons')({
  component: () => (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Icons</h1>
      <p className="mt-2 text-sm text-(--ui-text-subtle)">Coming soon.</p>
    </div>
  ),
});

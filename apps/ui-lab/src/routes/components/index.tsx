import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/components/')({
  component: () => (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Components</h1>
      <p className="mt-2 text-sm text-(--ui-text-subtle)">Browse by category using the sidebar.</p>
    </div>
  ),
});

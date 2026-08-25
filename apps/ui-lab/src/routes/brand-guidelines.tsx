import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/brand-guidelines')({
  component: () => (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Brand Guidelines</h1>
      <p className="mt-2 text-sm text-(--ui-text-subtle)">Coming soon.</p>
    </div>
  ),
});

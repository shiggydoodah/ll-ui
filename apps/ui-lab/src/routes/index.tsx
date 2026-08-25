import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: () => (
    <div className="p-8">
      <h1 className="text-2xl font-bold">UI Lab</h1>
    </div>
  ),
});

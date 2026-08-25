import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { scrollAreaSpecimen } from '@ll-ui/react/specimens';
import { ScrollArea } from '@ll-ui/react/components';

const tags = [
  'Design',
  'Engineering',
  'Product',
  'Marketing',
  'Operations',
  'Finance',
  'Support',
  'Research',
  'Legal',
  'People',
];

/**
 * Companion showcase for the horizontal axis — a single-row, touch-friendly tag rail
 * that the prop-driven specimen (a square box) cannot express as clearly.
 */
const HorizontalExample = () => (
  <div className="flex flex-col gap-4 px-8 pb-12">
    <div>
      <h2 className="text-lg font-bold text-(--ui-foreground)">Horizontal rail</h2>
      <p className="mt-1 text-sm text-(--ui-text-subtle)">
        A constrained width plus <code>orientation=&quot;horizontal&quot;</code> turns a wide row
        into a swipeable rail — the bar fades in while scrolling (
        <code>type=&quot;scroll&quot;</code>).
      </p>
    </div>
    <ScrollArea
      orientation="horizontal"
      aria-label="Team tags"
      className="w-full max-w-xl rounded-md border border-(--ui-border)"
    >
      <div className="flex w-max gap-2 p-3">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-(--ui-border) px-3 py-1.5 text-sm whitespace-nowrap text-(--ui-text-body)"
          >
            {tag}
          </span>
        ))}
      </div>
    </ScrollArea>
  </div>
);

export const Route = createFileRoute('/components/composed/scroll-area')({
  component: () => (
    <>
      <SpecimenPage specimen={scrollAreaSpecimen} />
      <HorizontalExample />
    </>
  ),
});

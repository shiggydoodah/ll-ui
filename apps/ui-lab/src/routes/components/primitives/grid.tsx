import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { gridSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/primitives/grid')({
  component: () => <SpecimenPage specimen={gridSpecimen} />,
});

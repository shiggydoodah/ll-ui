import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { displaySpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/primitives/display')({
  component: () => <SpecimenPage specimen={displaySpecimen} />,
});

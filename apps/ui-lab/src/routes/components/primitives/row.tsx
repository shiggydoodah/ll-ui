import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { rowSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/primitives/row')({
  component: () => <SpecimenPage specimen={rowSpecimen} />,
});

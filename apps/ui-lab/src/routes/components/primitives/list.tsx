import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { listSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/primitives/list')({
  component: () => <SpecimenPage specimen={listSpecimen} />,
});

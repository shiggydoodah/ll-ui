import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { tableSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/primitives/table')({
  component: () => <SpecimenPage specimen={tableSpecimen} />,
});

import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { headingSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/primitives/heading')({
  component: () => <SpecimenPage specimen={headingSpecimen} />,
});

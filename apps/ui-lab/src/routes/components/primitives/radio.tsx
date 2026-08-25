import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { radioSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/primitives/radio')({
  component: () => <SpecimenPage specimen={radioSpecimen} />,
});

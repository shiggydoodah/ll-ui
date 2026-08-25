import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { stackSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/primitives/stack')({
  component: () => <SpecimenPage specimen={stackSpecimen} />,
});

import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { buttonSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/primitives/button')({
  component: () => <SpecimenPage specimen={buttonSpecimen} />,
});

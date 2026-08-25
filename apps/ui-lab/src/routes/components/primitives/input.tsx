import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { inputSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/primitives/input')({
  component: () => <SpecimenPage specimen={inputSpecimen} />,
});

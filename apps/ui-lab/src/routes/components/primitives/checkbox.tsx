import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { checkboxSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/primitives/checkbox')({
  component: () => <SpecimenPage specimen={checkboxSpecimen} />,
});

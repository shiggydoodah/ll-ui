import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { dialogSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/composed/dialog')({
  component: () => <SpecimenPage specimen={dialogSpecimen} />,
});

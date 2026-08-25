import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { actionModalSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/composed/action-modal')({
  component: () => <SpecimenPage specimen={actionModalSpecimen} />,
});

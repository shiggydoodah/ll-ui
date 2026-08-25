import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { hoverCardSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/composed/hover-card')({
  component: () => <SpecimenPage specimen={hoverCardSpecimen} />,
});

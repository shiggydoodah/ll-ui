import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { calloutSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/composed/callout')({
  component: () => <SpecimenPage specimen={calloutSpecimen} />,
});

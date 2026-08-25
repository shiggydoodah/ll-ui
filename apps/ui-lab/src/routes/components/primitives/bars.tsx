import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { barsSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/primitives/bars')({
  component: () => <SpecimenPage specimen={barsSpecimen} />,
});

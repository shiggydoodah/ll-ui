import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { dividerSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/primitives/divider')({
  component: () => <SpecimenPage specimen={dividerSpecimen} />,
});

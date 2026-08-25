import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { selectSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/primitives/select')({
  component: () => <SpecimenPage specimen={selectSpecimen} />,
});

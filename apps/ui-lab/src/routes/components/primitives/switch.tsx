import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { switchSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/primitives/switch')({
  component: () => <SpecimenPage specimen={switchSpecimen} />,
});

import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { statusDotSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/primitives/status-dot')({
  component: () => <SpecimenPage specimen={statusDotSpecimen} />,
});

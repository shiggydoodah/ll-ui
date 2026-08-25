import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { progressBarSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/primitives/progress-bar')({
  component: () => <SpecimenPage specimen={progressBarSpecimen} />,
});

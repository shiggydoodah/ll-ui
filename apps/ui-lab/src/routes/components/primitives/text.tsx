import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { textSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/primitives/text')({
  component: () => <SpecimenPage specimen={textSpecimen} />,
});

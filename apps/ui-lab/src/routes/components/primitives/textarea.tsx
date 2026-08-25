import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { textareaSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/primitives/textarea')({
  component: () => <SpecimenPage specimen={textareaSpecimen} />,
});

import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { messageBubbleSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/composed/message-bubble')({
  component: () => <SpecimenPage specimen={messageBubbleSpecimen} />,
});

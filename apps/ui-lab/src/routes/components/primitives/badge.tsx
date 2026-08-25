import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { badgeSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/primitives/badge')({
  component: () => <SpecimenPage specimen={badgeSpecimen} />,
});

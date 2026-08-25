import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { countBadgeSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/primitives/count-badge')({
  component: () => <SpecimenPage specimen={countBadgeSpecimen} />,
});

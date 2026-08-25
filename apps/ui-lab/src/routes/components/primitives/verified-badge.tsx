import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { verifiedBadgeSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/primitives/verified-badge')({
  component: () => <SpecimenPage specimen={verifiedBadgeSpecimen} />,
});

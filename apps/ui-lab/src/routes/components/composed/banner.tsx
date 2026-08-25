import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { bannerSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/composed/banner')({
  component: () => <SpecimenPage specimen={bannerSpecimen} />,
});

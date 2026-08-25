import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { metricInputSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/composed/metric-input')({
  component: () => <SpecimenPage specimen={metricInputSpecimen} />,
});

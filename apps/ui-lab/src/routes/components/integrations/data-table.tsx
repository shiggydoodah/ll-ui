import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { dataTableSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/integrations/data-table')({
  component: () => <SpecimenPage specimen={dataTableSpecimen} />,
});

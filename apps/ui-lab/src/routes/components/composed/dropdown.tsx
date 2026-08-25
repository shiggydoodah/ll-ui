import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { dropDownSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/composed/dropdown')({
  component: () => <SpecimenPage specimen={dropDownSpecimen} />,
});

import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { fileUploadSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/composed/file-upload')({
  component: () => <SpecimenPage specimen={fileUploadSpecimen} />,
});

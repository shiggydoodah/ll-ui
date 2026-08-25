import { createFileRoute } from '@tanstack/react-router';
import { SpecimenPage } from '@/components/SpecimenPage';
import { passwordStrengthMeterSpecimen } from '@ll-ui/react/specimens';

export const Route = createFileRoute('/components/composed/password-strength-meter')({
  component: () => <SpecimenPage specimen={passwordStrengthMeterSpecimen} />,
});

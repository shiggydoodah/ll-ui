import { Field, FieldControl, FieldError, FieldHint, FieldLabel, Input, cn } from '@ll-ui/react';
import { useTanStackFieldContext } from '@ll-ui/react/integrations';
import { useMemo, type ReactNode } from 'react';

import { PasswordStrengthMeter } from '@ll-ui/react';

import { calcPasswordStrength } from './password-strength';

const firstError = (errors: ReadonlyArray<unknown>): string | undefined => {
  for (const error of errors) {
    if (typeof error === 'string' && error.length > 0) return error;
    if (error && typeof error === 'object' && 'message' in error) {
      const message = (error as { message: unknown }).message;
      if (typeof message === 'string' && message.length > 0) return message;
    }
  }
  return undefined;
};

export interface PasswordFieldProps {
  autoComplete?: string;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  hint?: ReactNode;
  label: ReactNode;
  /**
   * The schema's real minimum password length. Required so the strength meter
   * can never report strength for a length the field's validator rejects.
   */
  minLength: number;
  placeholder?: string;
  required?: boolean;
}

export const PasswordField = ({
  autoComplete = 'new-password',
  className,
  disabled,
  fullWidth = true,
  hint,
  label,
  minLength,
  placeholder,
  required = false,
}: PasswordFieldProps) => {
  const field = useTanStackFieldContext<string | undefined>();
  const value = field.state.value ?? '';
  const invalid = field.state.meta.errors.length > 0;
  const errorMessage = firstError(field.state.meta.errors);

  const strength = useMemo(() => calcPasswordStrength(value, minLength), [value, minLength]);

  return (
    <Field
      className={cn(fullWidth && 'w-full', className)}
      disabled={disabled}
      invalid={invalid}
      name={field.name}
      required={required}
    >
      <FieldLabel>{label}</FieldLabel>
      <FieldHint>{hint}</FieldHint>
      <FieldControl>
        <Input
          autoComplete={autoComplete}
          onBlur={field.handleBlur}
          onChange={(event) => field.handleChange(event.currentTarget.value)}
          placeholder={placeholder}
          type="password"
          value={value}
        />
      </FieldControl>
      <PasswordStrengthMeter strength={strength} />
      <FieldError>{errorMessage}</FieldError>
    </Field>
  );
};

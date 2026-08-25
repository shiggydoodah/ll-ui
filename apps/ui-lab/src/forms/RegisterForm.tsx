import { MIN_PASSWORD_LENGTH, emailSchema, passwordSchema } from './schemas';
import type { PasswordStrength } from '@ll-ui/react';
import { Form, useFormValue, type FormSubmitResult } from '@ll-ui/react/integrations';
import { z } from 'zod';

import { calcPasswordStrength, useAppForm } from '../form';

const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    agreeToTerms: z.literal(true, {
      error: 'You must agree to the terms',
    }),
    wantsSecurityQuestion: z.boolean(),
    securityQuestion: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type RegisterValues = {
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  wantsSecurityQuestion: boolean;
  securityQuestion?: string;
};

type FieldKey =
  | 'email'
  | 'password'
  | 'confirmPassword'
  | 'agreeToTerms'
  | 'wantsSecurityQuestion'
  | 'securityQuestion';

const parseFieldErrors = (value: RegisterValues): Partial<Record<FieldKey, string>> | undefined => {
  const result = registerSchema.safeParse(value);
  if (result.success) return undefined;

  const fields: Partial<Record<FieldKey, string>> = {};
  for (const issue of result.error.issues) {
    const path = issue.path[0] as FieldKey | undefined;
    if (!path) continue;
    if (!fields[path]) fields[path] = issue.message;
  }
  return Object.keys(fields).length > 0 ? fields : undefined;
};

// Deterministic mock-server failure trigger, mirroring LoginForm's
// locked@example.com path — keeps the demo (and its tests) reproducible.
const TAKEN_EMAIL = 'taken@example.com';

// Mirrors the library's 0-5 PasswordStrength scale; 1 is unreachable here
// because calcPasswordStrength folds "very weak" into "weak".
const STRENGTH_LABEL: Record<PasswordStrength, string> = {
  0: 'too short',
  1: 'very weak',
  2: 'weak',
  3: 'medium',
  4: 'strong',
  5: 'very strong',
};

// Uses the same scorer as the field's inline meter (threaded with the schema's
// real minimum) so the summary and the meter can never disagree.
const PasswordStrengthSummary = () => {
  const password = useFormValue<RegisterValues, 'password'>('password') ?? '';
  const label =
    password.length === 0
      ? 'empty'
      : STRENGTH_LABEL[calcPasswordStrength(password, MIN_PASSWORD_LENGTH)];
  return (
    <p className="text-xs text-(--ui-text-subtle)">
      Password strength: <strong data-testid="password-strength-summary">{label}</strong>
    </p>
  );
};

export const RegisterForm = () => {
  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
      wantsSecurityQuestion: false,
      securityQuestion: '',
    } as RegisterValues,
    validators: {
      onSubmit: ({ value }) => {
        const fields = parseFieldErrors(value);
        return fields ? { fields } : undefined;
      },
    },
    // Simulated server rejection lives in the submit handler, not the validator
    // — validation stays pure and side-effect free. It is *returned* as
    // { ok: false, error } rather than pushed in with setErrorMap, so the form
    // hook both wires the message up and counts the attempt as failed; writing
    // it imperatively would leave submitSuccess reporting a clean submit while
    // the error is on screen.
    onSubmit: async ({ value }): Promise<FormSubmitResult<RegisterValues>> => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (value.email === TAKEN_EMAIL) {
        return { ok: false, error: { api: 'Mock submission failed. Try again.' } };
      }

      return { ok: true };
    },
  });

  return (
    <Form form={form}>
      <form.TextField
        hint={`We'll never share it. Use ${TAKEN_EMAIL} to see the submit failure path.`}
        label="Email"
        name="email"
        placeholder="person@example.com"
        required
        type="email"
      />

      <form.PasswordField
        autoComplete="new-password"
        hint="Mix letters, numbers, and symbols for a stronger score."
        label="Password"
        minLength={MIN_PASSWORD_LENGTH}
        name="password"
        required
      />

      <form.TextField label="Confirm password" name="confirmPassword" required type="password" />

      <form.CheckboxField label="I agree to the terms of service" name="agreeToTerms" />

      <form.CheckboxField
        label="Set a security question"
        name="wantsSecurityQuestion"
        resetOnChange={['securityQuestion']}
      />

      <form.Subscribe selector={(state) => state.values.wantsSecurityQuestion}>
        {(enabled) =>
          enabled ? (
            <form.TextField
              hint="Toggling the checkbox above clears this field."
              label="Security question"
              name="securityQuestion"
            />
          ) : null
        }
      </form.Subscribe>

      <form.Subscribe selector={(state) => state.values.email}>
        {(email) =>
          email.toLowerCase().endsWith('@example.com') ? (
            <p
              className="rounded-sm border border-(--ui-border) bg-(--ui-background) p-3 text-sm"
              data-testid="bonus-tip"
            >
              🎁 Sign up bonus: <code>@example.com</code> accounts get a welcome credit.
            </p>
          ) : null
        }
      </form.Subscribe>

      <PasswordStrengthSummary />

      <form.Errors />

      <form.SubmitButton>Create account</form.SubmitButton>
    </Form>
  );
};

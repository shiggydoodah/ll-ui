import { emailSchema } from './schemas';
import { Button } from '@ll-ui/react';
import { Form, useFormTask, type FormSubmitResult } from '@ll-ui/react/integrations';
import { z } from 'zod';

import { useAppForm } from '../form';

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean(),
});

type LoginValues = z.infer<typeof loginSchema>;
type FieldKey = keyof LoginValues;

const parseFieldErrors = (value: LoginValues): Partial<Record<FieldKey, string>> | undefined => {
  const result = loginSchema.safeParse(value);
  if (result.success) return undefined;

  const fields: Partial<Record<FieldKey, string>> = {};
  for (const issue of result.error.issues) {
    const path = issue.path[0] as FieldKey | undefined;
    if (!path) continue;
    if (!fields[path]) fields[path] = issue.message;
  }
  return Object.keys(fields).length > 0 ? fields : undefined;
};

const VerifyEmailButton = () => {
  const { isBusy, runTask } = useFormTask();

  const handleClick = () => {
    void runTask(new Promise<void>((resolve) => setTimeout(resolve, 1500)));
  };

  return (
    <Button
      disabled={isBusy}
      loading={isBusy}
      onClick={handleClick}
      tone="neutral"
      type="button"
      variant="outline"
    >
      Verify email
    </Button>
  );
};

export const LoginForm = () => {
  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    } as LoginValues,
    validators: {
      onSubmit: ({ value }) => {
        const fields = parseFieldErrors(value);
        return fields ? { fields } : undefined;
      },
    },
    // Mock-server rejections are returned as { ok: false, error }, not written
    // imperatively with setErrorMap: returning the error is what lets the form
    // hook wire it up *and* record the attempt as failed, so submitFailed /
    // submitSuccess and any onError callback agree with what the user sees.
    // `api` renders through <form.Errors />; any other key is field-scoped.
    onSubmit: async ({ value }): Promise<FormSubmitResult<LoginValues>> => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (value.password === 'wrong') {
        return { ok: false, error: { password: 'Incorrect password' } };
      }

      if (value.email === 'locked@example.com') {
        return { ok: false, error: { api: 'Account locked. Contact support.' } };
      }

      return { ok: true };
    },
  });

  return (
    <Form form={form}>
      <form.TextField
        hint="Use locked@example.com to see the form-level error path."
        label="Email"
        name="email"
        placeholder="person@example.com"
        required
        type="email"
      />

      <form.TextField
        hint='Use "wrong" to see the field-level error path.'
        label="Password"
        name="password"
        required
        type="password"
      />

      <form.CheckboxField label="Remember me on this device" name="rememberMe" />

      <form.Errors />

      {/* Surfaces the hook's own submit accounting so the demo can be checked
          against it: a rejected submit must read as failed here, never as a
          success sitting next to a visible error. */}
      <p className="text-xs text-(--ui-text-subtle)" data-testid="submit-status">
        {form.submitSuccess
          ? 'Signed in.'
          : form.submitFailed
            ? `Sign-in failed (attempt ${form.submitCount}).`
            : 'Not submitted yet.'}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <VerifyEmailButton />
        <form.SubmitButton>Sign in</form.SubmitButton>
      </div>
    </Form>
  );
};

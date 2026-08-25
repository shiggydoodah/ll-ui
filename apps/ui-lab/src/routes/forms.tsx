import { createFileRoute } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import { LoginForm } from '@/forms/LoginForm';
import { RegisterForm } from '@/forms/RegisterForm';

const FormCard = ({
  title,
  description,
  children,
}: {
  title: string;
  description: ReactNode;
  children: ReactNode;
}) => (
  <section className="flex min-w-0 flex-1 basis-96 flex-col gap-4 rounded-lg border border-(--ui-border) bg-(--ui-background) p-6">
    <div className="flex flex-col gap-1">
      <h2 className="font-display text-lg font-bold">{title}</h2>
      <p className="text-sm text-(--ui-text-subtle)">{description}</p>
    </div>
    {children}
  </section>
);

const FormsShowcase = () => (
  <div className="flex flex-col gap-8 p-8">
    <header className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Forms</h1>
      <p className="max-w-3xl text-sm text-(--ui-text-subtle)">
        Full TanStack Form integration built on the <code>@ll-ui/react</code> field wrappers:{' '}
        <code>form.TextField</code>, <code>form.CheckboxField</code> and a lab-local{' '}
        <code>form.PasswordField</code> registered via <code>useAppForm</code>. The demos cover
        zod-schema validation surfaced per field, async submit handlers with pending/disabled
        states, server-style form- and field-level errors, dependent fields that reset each other,
        and a shared busy state (<code>useFormTask</code>) that locks the submit button while a side
        task runs.
      </p>
    </header>

    <div className="flex flex-wrap gap-6">
      <FormCard
        title="Login"
        description={
          <>
            Field-level and form-level server errors. Try password <code>wrong</code> or email{' '}
            <code>locked@example.com</code>, or run the verify-email task to see the shared busy
            state.
          </>
        }
      >
        <LoginForm />
      </FormCard>

      <FormCard
        title="Register"
        description={
          <>
            Schema-driven validation, a password strength meter fed by the schema&apos;s real
            minimum length, dependent fields, and a deterministic mock server failure via{' '}
            <code>taken@example.com</code>.
          </>
        }
      >
        <RegisterForm />
      </FormCard>
    </div>
  </div>
);

export const Route = createFileRoute('/forms')({
  component: FormsShowcase,
});

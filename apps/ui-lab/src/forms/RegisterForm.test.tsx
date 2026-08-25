// @vitest-environment jsdom

import { act } from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { RegisterForm } from './RegisterForm';
import { findInputByLabel, renderForm, setNativeValue, waitFor } from './test-utils';

describe('RegisterForm', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('submits successfully with valid input', async () => {
    const rendered = await renderForm(<RegisterForm />);
    const emailInput = findInputByLabel(rendered.container, 'Email');
    const passwordInput = findInputByLabel(rendered.container, 'Password');
    const confirmInput = findInputByLabel(rendered.container, 'Confirm password');
    const agreeCheckbox = findInputByLabel(rendered.container, 'I agree');
    const submitButton =
      rendered.container.querySelector<HTMLButtonElement>('button[type="submit"]');

    if (!submitButton) throw new Error('Submit button not found');

    await act(async () => {
      setNativeValue(emailInput, 'jane@example.com');
      setNativeValue(passwordInput, 'Pa55word!');
      setNativeValue(confirmInput, 'Pa55word!');
      agreeCheckbox.click();
    });

    await act(async () => {
      submitButton.click();
    });

    // SubmitButton disables itself while form.state.isSubmitting is true, so the
    // form is provably in flight here and the wait below cannot pass vacuously.
    expect(submitButton.disabled).toBe(true);

    // onSubmit resolves on a 500ms timer; wait for the button to re-enable rather
    // than assuming a fixed budget is enough.
    await waitFor(() => !submitButton.disabled);

    // After success, the form clears submission state; no form-level errors should be shown.
    expect(rendered.container.querySelector('[role="alert"]')).toBeNull();
    expect(submitButton.disabled).toBe(false);

    await rendered.unmount();
  }, 15_000);

  it('renders a form-level error when the server rejects the email', async () => {
    const rendered = await renderForm(<RegisterForm />);
    const emailInput = findInputByLabel(rendered.container, 'Email');
    const passwordInput = findInputByLabel(rendered.container, 'Password');
    const confirmInput = findInputByLabel(rendered.container, 'Confirm password');
    const agreeCheckbox = findInputByLabel(rendered.container, 'I agree');
    const submitButton =
      rendered.container.querySelector<HTMLButtonElement>('button[type="submit"]');

    if (!submitButton) throw new Error('Submit button not found');

    await act(async () => {
      setNativeValue(emailInput, 'taken@example.com');
      setNativeValue(passwordInput, 'Pa55word!');
      setNativeValue(confirmInput, 'Pa55word!');
      agreeCheckbox.click();
    });

    await act(async () => {
      submitButton.click();
    });

    await waitFor(() => !submitButton.disabled);

    const alert = rendered.container.querySelector('[role="alert"]');
    expect(alert).not.toBeNull();
    expect(alert?.textContent).toContain('Mock submission failed');

    await rendered.unmount();
  }, 15_000);
});

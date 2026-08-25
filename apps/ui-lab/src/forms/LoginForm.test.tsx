// @vitest-environment jsdom

import { act } from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { LoginForm } from './LoginForm';
import { findInputByLabel, renderForm, setNativeValue, waitFor } from './test-utils';

const findButtonByText = (container: HTMLElement, text: string): HTMLButtonElement => {
  for (const button of container.querySelectorAll('button')) {
    if (button.textContent?.includes(text)) return button as HTMLButtonElement;
  }
  throw new Error(`Could not find button with text: ${text}`);
};

const submit = async (container: HTMLElement) => {
  const form = container.querySelector('form');
  if (!form) throw new Error('form not found');
  await act(async () => {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
};

const submitStatus = (container: HTMLElement): string =>
  container.querySelector('[data-testid="submit-status"]')?.textContent ?? '';

const fillCredentials = async (container: HTMLElement, email: string, password: string) => {
  const emailInput = findInputByLabel(container, 'Email');
  const passwordInput = findInputByLabel(container, 'Password');
  await act(async () => {
    setNativeValue(emailInput, email);
    setNativeValue(passwordInput, password);
  });
};

// The submit handler resolves on a 500ms timer; poll for the button to
// re-enable rather than assuming a fixed sleep budget is enough.
const waitForSubmitToSettle = async (container: HTMLElement) => {
  const submitButton = findButtonByText(container, 'Sign in');
  await waitFor(() => !submitButton.disabled);
};

describe('LoginForm', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('submits successfully with a valid email and password', async () => {
    const rendered = await renderForm(<LoginForm />);
    await fillCredentials(rendered.container, 'user@example.test', 'Pa55word');

    await submit(rendered.container);
    await waitForSubmitToSettle(rendered.container);

    expect(rendered.container.querySelector('[role="alert"]')).toBeNull();
    const passwordInput = findInputByLabel(rendered.container, 'Password');
    expect(passwordInput.getAttribute('aria-invalid')).not.toBe('true');
    expect(submitStatus(rendered.container)).toBe('Signed in.');

    await rendered.unmount();
  });

  it('renders a field-level error when the password is "wrong"', async () => {
    const rendered = await renderForm(<LoginForm />);
    await fillCredentials(rendered.container, 'user@example.test', 'wrong');

    await submit(rendered.container);
    await waitForSubmitToSettle(rendered.container);

    expect(rendered.container.textContent).toContain('Incorrect password');
    const passwordInput = findInputByLabel(rendered.container, 'Password');
    expect(passwordInput.getAttribute('aria-invalid')).toBe('true');
    // A field-scoped server rejection is still a failed submit.
    expect(submitStatus(rendered.container)).toContain('Sign-in failed');

    await rendered.unmount();
  });

  it('renders a form-level error for locked accounts', async () => {
    const rendered = await renderForm(<LoginForm />);
    await fillCredentials(rendered.container, 'locked@example.com', 'Pa55word');

    await submit(rendered.container);
    await waitForSubmitToSettle(rendered.container);

    const alert = rendered.container.querySelector('[role="alert"]');
    expect(alert).not.toBeNull();
    expect(alert?.textContent).toContain('Account locked');
    // The regression this guards: returning the error (rather than writing it
    // with setErrorMap) is what makes submitFailed true, so the form can never
    // report a clean submit while an error is on screen.
    expect(submitStatus(rendered.container)).toContain('Sign-in failed');
    expect(submitStatus(rendered.container)).not.toContain('Signed in');

    await rendered.unmount();
  });

  it('disables the submit button while the verify-email task runs', async () => {
    const rendered = await renderForm(<LoginForm />);
    const verifyButton = findButtonByText(rendered.container, 'Verify email');
    const submitButton = findButtonByText(rendered.container, 'Sign in');

    expect(submitButton.disabled).toBe(false);

    await act(async () => {
      verifyButton.click();
    });

    expect(submitButton.disabled).toBe(true);

    // The verify task resolves on a 1.5s timer — poll instead of sleeping.
    await waitFor(() => !submitButton.disabled);

    expect(submitButton.disabled).toBe(false);

    await rendered.unmount();
  });
});

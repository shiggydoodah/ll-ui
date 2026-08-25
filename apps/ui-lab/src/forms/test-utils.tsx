// Shared jsdom helpers for the form demo tests. These render without a test
// framework wrapper on purpose — the forms are plain React trees, so createRoot
// plus a handful of DOM queries keeps the tests dependency-free.

import { act, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';

interface ReactActGlobal {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
}
(globalThis as ReactActGlobal).IS_REACT_ACT_ENVIRONMENT = true;

export interface RenderResult {
  container: HTMLElement;
  root: Root;
  unmount: () => Promise<void>;
}

export const renderForm = async (ui: ReactElement): Promise<RenderResult> => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(ui);
  });

  return {
    container,
    root,
    unmount: async () => {
      await act(async () => {
        root.unmount();
      });
      container.remove();
    },
  };
};

// React tracks the value prop on controlled inputs, so a plain `.value =`
// assignment is swallowed. Calling the native setter then dispatching `input`
// makes React see the change like a real keystroke.
export const setNativeValue = (input: HTMLInputElement, value: string) => {
  const valueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value',
  )?.set;
  valueSetter?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
};

export const findInputByLabel = (container: HTMLElement, label: string): HTMLInputElement => {
  for (const labelEl of container.querySelectorAll('label')) {
    if (labelEl.textContent?.includes(label)) {
      const id = labelEl.getAttribute('for');
      if (id) {
        const input = container.querySelector<HTMLInputElement>(`[id="${id}"]`);
        if (input) return input;
      }
    }
  }
  throw new Error(`Could not find input for label: ${label}`);
};

// Polls until the predicate holds. The forms settle on real timers, so a fixed
// sleep races with them whenever the suite runs under load.
export const waitFor = async (
  predicate: () => boolean,
  { timeout = 5_000, interval = 20 }: { timeout?: number; interval?: number } = {},
): Promise<void> => {
  const start = Date.now();

  while (!predicate()) {
    if (Date.now() - start >= timeout) {
      throw new Error(`Timed out after ${timeout}ms waiting for the form to settle`);
    }

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, interval));
    });
  }
};

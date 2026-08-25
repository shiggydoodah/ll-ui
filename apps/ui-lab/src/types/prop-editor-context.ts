import { createContext, useContext } from 'react';
import type { ControlType } from '@ll-ui/react/specimens';

// The library's ArgDef<T> is conditional on the prop's type — great for
// authoring specimens, but the editor receives arbitrary specimens at runtime
// and only needs the common structure, so it works against this view instead.
export type EditorArgDef = {
  control: ControlType;
  defaultValue?: unknown;
  options?: readonly unknown[];
};

export type EditorArgTypes = Record<string, EditorArgDef | undefined>;

export type PropEditorContextValue = {
  argTypes: EditorArgTypes;
  props: Record<string, unknown>;
  setProps: (props: Record<string, unknown>) => void;
  setSpecimen: (argTypes: EditorArgTypes, defaultProps: Record<string, unknown>) => void;
};

const noop = () => {};

export const PropEditorContext = createContext<PropEditorContextValue>({
  argTypes: {},
  props: {},
  setProps: noop,
  setSpecimen: noop,
});

export const usePropEditor = () => useContext(PropEditorContext);

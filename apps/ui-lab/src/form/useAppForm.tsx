import { useAppForm as baseUseAppForm } from '@ll-ui/react/integrations';
import type {
  DeepKeys,
  FormAsyncValidateOrFn,
  FormOptions,
  FormValidateOrFn,
} from '@tanstack/react-form';
import { useMemo, type ComponentType, type ReactElement } from 'react';

import { PasswordField, type PasswordFieldProps } from './fields/PasswordField';

interface AnyFormApiInternal {
  AppField: ComponentType<{
    name: string;
    listeners?: { onChange?: (args: { value: unknown }) => void };
    children: (field: unknown) => ReactElement;
  }>;
  setFieldValue: (name: string, updater: unknown) => void;
}

interface ExtendedRegistry<TFormData> {
  PasswordField: (
    props: PasswordFieldProps & {
      name: DeepKeys<TFormData>;
      resetOnChange?: ReadonlyArray<DeepKeys<TFormData>>;
    },
  ) => ReactElement;
}

interface BoundFieldRendererProps<TInnerProps extends object> {
  Component: ComponentType<TInnerProps>;
  form: AnyFormApiInternal;
  name: string;
  resetOnChange?: ReadonlyArray<string>;
  rest: TInnerProps;
}

const BoundFieldRenderer = <TInnerProps extends object>({
  Component,
  form,
  name,
  resetOnChange,
  rest,
}: BoundFieldRendererProps<TInnerProps>): ReactElement => {
  const listeners = useMemo(() => {
    if (!resetOnChange || resetOnChange.length === 0) return undefined;
    return {
      onChange: () => {
        for (const path of resetOnChange) {
          form.setFieldValue(path, undefined);
        }
      },
    };
  }, [form, resetOnChange]);

  return (
    <form.AppField name={name} listeners={listeners}>
      {() => <Component {...rest} />}
    </form.AppField>
  );
};

const createBoundField = <TInnerProps extends object>(
  form: AnyFormApiInternal,
  Component: ComponentType<TInnerProps>,
  displayName: string,
) => {
  const BoundField = (
    props: TInnerProps & { name: string; resetOnChange?: ReadonlyArray<string> },
  ) => {
    const { name, resetOnChange, ...rest } = props;
    return (
      <BoundFieldRenderer
        Component={Component}
        form={form}
        name={name}
        resetOnChange={resetOnChange}
        rest={rest as unknown as TInnerProps}
      />
    );
  };
  BoundField.displayName = displayName;
  return BoundField;
};

export const useAppForm = <
  TFormData,
  TOnMount extends FormValidateOrFn<TFormData> | undefined,
  TOnChange extends FormValidateOrFn<TFormData> | undefined,
  TOnChangeAsync extends FormAsyncValidateOrFn<TFormData> | undefined,
  TOnBlur extends FormValidateOrFn<TFormData> | undefined,
  TOnBlurAsync extends FormAsyncValidateOrFn<TFormData> | undefined,
  TOnSubmit extends FormValidateOrFn<TFormData> | undefined,
  TOnSubmitAsync extends FormAsyncValidateOrFn<TFormData> | undefined,
  TOnDynamic extends FormValidateOrFn<TFormData> | undefined,
  TOnDynamicAsync extends FormAsyncValidateOrFn<TFormData> | undefined,
  TOnServer extends FormAsyncValidateOrFn<TFormData> | undefined,
  TSubmitMeta,
>(
  options: FormOptions<
    TFormData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnDynamic,
    TOnDynamicAsync,
    TOnServer,
    TSubmitMeta
  >,
): ReturnType<
  typeof baseUseAppForm<
    TFormData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnDynamic,
    TOnDynamicAsync,
    TOnServer,
    TSubmitMeta
  >
> &
  ExtendedRegistry<TFormData> => {
  const form = baseUseAppForm(options);

  const extras = useMemo(() => {
    const internalForm = form as unknown as AnyFormApiInternal;
    return {
      PasswordField: createBoundField(internalForm, PasswordField, 'BoundPasswordField'),
    };
  }, [form]);

  return Object.assign(form, extras) as ReturnType<
    typeof baseUseAppForm<
      TFormData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnDynamic,
      TOnDynamicAsync,
      TOnServer,
      TSubmitMeta
    >
  > &
    ExtendedRegistry<TFormData>;
};

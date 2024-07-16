import React, { ChangeEvent, ComponentProps } from "react";
import {
  Controller,
  ControllerFieldState,
  ControllerProps,
  ControllerRenderProps,
  FieldPath,
  FieldPathValue,
  FieldValues,
  useFormContext,
  UseFormReturn,
  UseFormStateReturn,
} from "react-hook-form";

export interface IFormFieldProps<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
> extends Omit<ControllerProps<T, TName>, "control" | "render"> {
  render: ({
    field,
    fieldState,
    formState,
  }: {
    field: Omit<ControllerRenderProps<T, TName>, "onChange"> & {
      onChange: (event: FieldPathValue<T, TName> | ChangeEvent) => void;
    };
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<T>;
    form: Omit<UseFormReturn<T, TName>, "control">;
  }) => React.ReactElement;
}

export const FormField = <
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
>({
  render,
  ...props
}: IFormFieldProps<T, TName>) => {
  const { control, ...rest } = useFormContext<T>();

  return (
    <Controller<T, TName>
      control={control}
      {...props}
      render={field => render({ ...field, form: rest })}
    />
  );
};

export const typedFormField =
  <T extends FieldValues = FieldValues>() =>
  <TName extends FieldPath<T> = FieldPath<T>>(
    props: ComponentProps<typeof FormField<T, TName>>,
  ) =>
    <FormField {...props} />;

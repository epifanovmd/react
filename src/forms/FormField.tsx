import React, { ComponentProps } from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  useFormContext,
  UseFormReturn,
} from "react-hook-form";

export interface IFormFieldProps<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
> extends Omit<ControllerProps<T, TName>, "control" | "render"> {
  render: ({
    field,
    fieldState,
    formState,
  }: Parameters<ControllerProps<T, TName>["render"]>[0] & {
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

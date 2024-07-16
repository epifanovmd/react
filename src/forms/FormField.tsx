import React from "react";
import {
  Controller,
  ControllerProps,
  FieldValues,
  useFormContext,
  UseFormReturn,
} from "react-hook-form";

export interface IFormFieldProps<T extends FieldValues = FieldValues>
  extends Omit<ControllerProps<T>, "control" | "render"> {
  render: ({
    field,
    fieldState,
    formState,
  }: Parameters<ControllerProps<T>["render"]>[0] & {
    form: Omit<UseFormReturn<T>, "control">;
  }) => React.ReactElement;
}

export const FormField = <T extends FieldValues = FieldValues>({
  render,
  ...props
}: IFormFieldProps<T>) => {
  const { control, ...rest } = useFormContext<T>();

  return (
    <Controller<T>
      control={control}
      {...props}
      render={field => render({ ...field, form: rest })}
    />
  );
};

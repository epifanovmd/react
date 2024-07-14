import React from "react";
import {
  Controller,
  ControllerProps,
  FieldValues,
  useFormContext,
} from "react-hook-form";

export const FormField = <T extends FieldValues = FieldValues>(
  props: Omit<ControllerProps<T>, "control">,
) => {
  const { control } = useFormContext<T>();

  return <Controller control={control} {...props} />;
};

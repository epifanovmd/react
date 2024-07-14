import React, { memo, PropsWithChildren } from "react";
import {
  FieldValues,
  FormProvider,
  useForm,
  UseFormProps,
} from "react-hook-form";

const _Form = <T extends FieldValues = FieldValues>({
  children,
  ...props
}: PropsWithChildren<UseFormProps<T>>) => {
  const form = useForm(props);

  return <FormProvider {...form}>{children}</FormProvider>;
};

export const Form = memo(_Form) as typeof _Form;

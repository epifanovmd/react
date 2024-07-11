import React, { memo } from "react";
import { Controller, FieldValues, FormProvider } from "react-hook-form";

import { IFormProps } from "./types";

const _Form = <T extends FieldValues>({
  fields,
  form,
  renderFieldLayout = children => <>{children}</>,
}: IFormProps<T>) => {
  return (
    <FormProvider {...form}>
      {fields.map(({ render = () => null, ...field }, index) => {
        return (
          <Controller
            key={`field-${field.name}-${index}`}
            {...field}
            control={form.control}
            render={controllerField =>
              renderFieldLayout(
                render({ ...controllerField, form }),
                controllerField,
              )
            }
          />
        );
      })}
    </FormProvider>
  );
};

export const Form = memo(_Form) as typeof _Form;

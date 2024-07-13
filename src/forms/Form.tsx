import React, { memo } from "react";
import { Controller, FieldValues, FormProvider } from "react-hook-form";

import { IFormProps } from "./types";

const _Form = <T extends FieldValues>({
  fields,
  form,
  renderFieldLayout = children => <>{children}</>,
  values = {} as T,
}: IFormProps<T>) => {
  return (
    <FormProvider {...form}>
      {fields.map(({ render = () => null, title, ...field }, index) => {
        return (
          <Controller
            key={`field-${field.name}-${index}`}
            shouldUnregister={field.shouldUnregister}
            rules={field.rules}
            defaultValue={field.defaultValue}
            disabled={field.disabled}
            name={field.name}
            control={form.control}
            render={controllerField =>
              renderFieldLayout(
                render({ ...controllerField, form, values, title }),
                {
                  ...controllerField,
                  form,
                  values,
                  title,
                },
              )
            }
          />
        );
      })}
    </FormProvider>
  );
};

export const Form = memo(_Form) as typeof _Form;

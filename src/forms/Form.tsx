import React, { memo } from "react";
import {
  Controller,
  ControllerProps,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";

export interface IFormField<T extends FieldValues = FieldValues>
  extends Omit<ControllerProps<T>, "control" | "render"> {
  render?: (
    field: Parameters<ControllerProps<T>["render"]>[0] & {
      form: UseFormReturn<T>;
    },
  ) => React.ReactElement | null;
}

export type IRenderFieldLayout<T extends FieldValues = FieldValues> = (
  children: React.ReactNode,
  field: Parameters<ControllerProps<T>["render"]>[0],
) => React.ReactElement;

export interface IFormProps<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>;
  fields: IFormField<T>[];
  renderFieldLayout?: IRenderFieldLayout<T>;
}

const _Form = <T extends FieldValues>({
  fields,
  form,
  renderFieldLayout = children => <>{children}</>,
}: IFormProps<T>) => {
  return (
    <>
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
    </>
  );
};

export const Form = memo(_Form) as typeof _Form;

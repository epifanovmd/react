import { FieldPath, FieldValues } from "react-hook-form";

import { IFormFieldItem, IWizard } from "./types";

export const createWizard = <T extends FieldValues>({
  key,
  params,
  handleSubmit,
}: Pick<IWizard<T>, "key" | "params" | "handleSubmit">) => {
  const { add, fields } = createFields<T>();

  const wizard: IWizard<T> = {
    key,
    params,
    fields,
    handleSubmit,
  };

  return { add, wizard };
};

export const createFields = <T extends FieldValues>() => {
  const fields: IFormFieldItem<T>[] = [];

  const add = <TName extends FieldPath<T> = FieldPath<T>>(
    data: IFormFieldItem<T, TName>,
  ) => {
    fields.push(data as any);

    return { add, fields };
  };

  return { add, fields };
};

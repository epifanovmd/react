import { useRef } from "react";
import { FieldValues, useForm, UseFormProps } from "react-hook-form";

import { IUseWizardReturn } from "./useWizard";

export const useWizardForm = <T extends FieldValues = FieldValues>(
  wizard: IUseWizardReturn<T>,
  params: UseFormProps<T>,
) => {
  const ref = useRef(false);
  const form = useForm(params);

  if (!ref.current) {
    wizard.register(form);
    ref.current = true;
  }

  return form;
};

import { useEffect } from "react";
import {
  FieldValues,
  useForm,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form";

export const useWizardForm = <T extends FieldValues = FieldValues>(
  register: (form: UseFormReturn<T>) => void,
  params: UseFormProps<T>,
) => {
  const form = useForm(params);

  useEffect(() => {
    register(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return form;
};

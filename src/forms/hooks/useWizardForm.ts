import { useEffect, useLayoutEffect, useRef } from "react";
import {
  FieldValues,
  useForm,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form";

import { IWizard } from "../Wizard";
import { IUseWizard, IUseWizardReturn } from "./useWizard";

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

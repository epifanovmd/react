import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  DeepPartial,
  FieldValues,
  FormState,
  UseFormReturn,
} from "react-hook-form";

import { useStep } from "./useStep";

interface Subscription {
  unsubscribe: () => void;
}

export interface IUseWizard<T extends FieldValues = FieldValues> {
  handleSubmit?: (values: T) => void;
  handleStepSubmit?: (step: number, values: T, form: UseFormReturn<T>) => void;
  watch?: (keyof DeepPartial<T>)[];
}

export interface IUseWizardReturn<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>;
  forms: UseFormReturn<T>[];
  formByStep: (step: number) => UseFormReturn<T>;
  values: T;
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  handleReset: () => void;
  register: (form: UseFormReturn<T>) => void;
}

export const useWizard = <T extends FieldValues = FieldValues>({
  handleSubmit,
  handleStepSubmit,
  watch,
}: IUseWizard<T>): IUseWizardReturn<T> => {
  const subscriptionRef = useRef<Subscription[]>([]);
  const formsRef = useRef<UseFormReturn<T>[]>([]);
  const [values, setValues] = useState<T>({} as T);
  const [step, nextStep, prevStep, reset] = useStep(
    0,
    formsRef.current.length - 1,
  );

  useEffect(() => {
    if (formsRef.current.length === 0) {
      throw Error("The wizard can be used with forms count > 0");
    }
  }, []);

  const subscribe = useCallback(
    (form: UseFormReturn<T>, index: number) => {
      if (subscriptionRef.current[index]) {
        subscriptionRef.current[index].unsubscribe();
      }

      subscriptionRef.current[index] = form.watch(value => {
        watch?.forEach(w => {
          if (w in value) {
            setValues(v => ({ ...v, [w]: value[w] }));
          }
        });
      });
    },
    [watch],
  );

  useEffect(() => {
    if (watch) {
      formsRef.current.forEach(subscribe);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribe]);

  const register = useCallback(
    (form: UseFormReturn<T>) => {
      subscribe(form, formsRef.current.length);

      formsRef.current.push(form);

      setValues(v => ({ ...v, ...form.formState.defaultValues }));
    },
    [subscribe],
  );

  const handleReset = useCallback(() => {
    formsRef.current.forEach(({ reset, formState }) => {
      reset();
      setValues(v => ({ ...v, ...formState.defaultValues }));
    });
    reset();
  }, [reset]);

  const handleNextStep = useCallback(() => {
    const form = formsRef.current[step];

    form.handleSubmit(data => {
      setValues(v => {
        const newValues = { ...v, ...data };

        if (step === formsRef.current.length - 1) {
          handleSubmit?.(newValues);
        } else {
          handleStepSubmit?.(step, newValues, form);
          nextStep();
        }

        return newValues;
      });
    })();
  }, [handleSubmit, handleStepSubmit, nextStep, step]);

  const formByStep = useCallback(
    (...args: [step: number]) => formsRef.current[args[0]],
    [],
  );

  const forms = formsRef.current;

  return {
    get form() {
      if (forms.length === 0) {
        throw Error("The wizard can be used with forms count > 0");
      }

      return forms[step];
    },
    forms,
    formByStep,
    values,
    step,
    nextStep: handleNextStep,
    prevStep,
    handleReset,
    register,
  };
};

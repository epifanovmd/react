import { useCallback, useEffect, useRef, useState } from "react";
import { DeepPartial, FieldValues, UseFormReturn } from "react-hook-form";

import { useStep } from "./useStep";

interface Subscription {
  unsubscribe: () => void;
}

export interface IUseWizard<T extends FieldValues = FieldValues> {
  handleSubmit: (values: T) => void;
  watch?: (keyof DeepPartial<T>)[];
}

export interface IUseWizardReturn<T extends FieldValues = FieldValues> {
  currentForm?: UseFormReturn<T>;
  values: T;
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  handleReset: () => void;
  register: (form: UseFormReturn<T>) => void;
}

export const useWizard = <T extends FieldValues = FieldValues>({
  handleSubmit,
  watch,
}: IUseWizard<T>): IUseWizardReturn<T> => {
  const subscriptionRef = useRef<Subscription[]>([]);
  const ref = useRef<UseFormReturn<T>[]>([]);
  const [values, setValues] = useState<T>({} as T);
  const [step, nextStep, prevStep, reset] = useStep(0);

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
      ref.current.forEach(subscribe);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribe]);

  const register = useCallback(
    (form: UseFormReturn<T>) => {
      subscribe(form, ref.current.length);

      ref.current.push(form);

      setValues(v => ({ ...v, ...form.formState.defaultValues }));
    },
    [subscribe],
  );

  const handleReset = useCallback(() => {
    ref.current.forEach(({ reset, formState }) => {
      reset();
      setValues(v => ({ ...v, ...formState.defaultValues }));
    });
    reset();
  }, [reset]);

  const handleNextStep = useCallback(() => {
    const form = ref.current[step];

    form.handleSubmit(data => {
      setValues(v => {
        const newValues = { ...v, ...data };

        if (step === ref.current.length - 1) {
          handleSubmit(newValues);
        } else {
          nextStep();
        }

        return newValues;
      });
    })();
  }, [handleSubmit, nextStep, step]);

  return {
    currentForm: ref.current[step],
    values,
    step,
    nextStep: handleNextStep,
    prevStep,
    handleReset,
    register,
  };
};

import { useCallback, useEffect, useRef, useState } from "react";
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
  currentForm?: UseFormReturn<T>;
  values: T;
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  handleReset: () => void;
  register: (form: UseFormReturn<T>) => void;
  getWizardState: () => FormState<T>;
}

export const useWizard = <T extends FieldValues = FieldValues>({
  handleSubmit,
  handleStepSubmit,
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
          handleSubmit?.(newValues);
        } else {
          handleStepSubmit?.(step, newValues, form);
          nextStep();
        }

        return newValues;
      });
    })();
  }, [handleSubmit, handleStepSubmit, nextStep, step]);

  const getWizardState = useCallback(
    () =>
      ref.current.reduce<FormState<T>>(
        (acc, form) => {
          acc.isSubmitting = acc.isSubmitting || form.formState.isSubmitting;
          acc.isDirty = acc.isDirty || form.formState.isDirty;
          acc.isSubmitted = acc.isSubmitted || form.formState.isSubmitted;
          acc.defaultValues = {
            ...((acc.defaultValues || {}) as any),
            ...(form.formState.defaultValues || {}),
          };
          acc.isValid = acc.isValid || form.formState.isValid;
          acc.errors = { ...acc.errors, ...form.formState.errors };
          acc.disabled = acc.disabled || form.formState.disabled;
          acc.isLoading = acc.isLoading || form.formState.isLoading;
          acc.dirtyFields = {
            ...acc.dirtyFields,
            ...form.formState.dirtyFields,
          };
          acc.isValidating = acc.isValidating || form.formState.isValidating;
          acc.submitCount = acc.submitCount || form.formState.submitCount;
          acc.touchedFields = {
            ...acc.touchedFields,
            ...form.formState.touchedFields,
          };
          acc.isSubmitSuccessful =
            acc.isSubmitSuccessful || form.formState.isSubmitSuccessful;
          acc.validatingFields = {
            ...acc.validatingFields,
            ...form.formState.validatingFields,
          };

          return acc;
        },
        {
          isSubmitting: false,
          isDirty: false,
          isSubmitted: false,
          defaultValues: undefined,
          isValid: false,
          errors: {},
          disabled: false,
          isLoading: false,
          dirtyFields: {},
          isValidating: false,
          submitCount: 0,
          touchedFields: {},
          isSubmitSuccessful: false,
          validatingFields: {},
        } as FormState<T>,
      ),
    [],
  );

  return {
    currentForm: ref.current[step],
    values,
    step,
    nextStep: handleNextStep,
    prevStep,
    handleReset,
    register,
    getWizardState,
  };
};

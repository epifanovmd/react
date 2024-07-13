import React, {
  memo,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FieldValues, useForm } from "react-hook-form";

import { Form } from "./Form";
import { useStep, WizardFormContext } from "./hooks";
import { IWizardActions, IWizardFormContext, IWizardFormProps } from "./types";

const isPromise = <T extends any>(obj: any | Promise<T>): obj is Promise<T> =>
  !!obj &&
  (typeof obj === "object" || typeof obj === "function") &&
  typeof obj.then === "function";

const _WizardForm = <T extends FieldValues>({
  wizards,
  renderHeader: RenderHeader = () => null,
  renderFooter: RenderFooter = () => null,
  onSubmit: handleSubmit,
  onChange,
}: PropsWithChildren<IWizardFormProps<T>>) => {
  const [values, update] = useState<T>({} as T);
  const [step, nextStep, prevStep, reset] = useStep(0, wizards.length - 1);

  useEffect(() => {
    const { unsubscribe } = _forms[step].watch(value => {
      onChange?.(v => ({ ...v, ...value }));
      update(v => ({ ...v, ...value }));
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const resetDefaultValues = useCallback(() => {
    wizards.forEach(({ params }) => {
      const p = typeof params === "function" ? params(values) : params;

      if (p.defaultValues) {
        update(v => ({ ...v, ...p.defaultValues }));
      }
    });
  }, [values, wizards]);

  useEffect(() => {
    resetDefaultValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _forms = useRef(
    wizards.map(({ params }) =>
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useForm(typeof params === "function" ? params(values) : params),
    ),
  ).current;

  const { key, params, fields, ...rest } = wizards[step];

  const providerValue = useMemo(() => {
    const isLastStep = step === wizards.length - 1;

    const resetAll = () => {
      wizards.forEach((w, index) => {
        const p = typeof w.params === "function" ? w.params(values) : w.params;

        _forms[index].reset();

        if (p.defaultValues) {
          update(v => ({ ...v, ...p.defaultValues }));
        }
      });

      reset();
    };

    const context: Omit<IWizardFormContext<T>, keyof IWizardActions> = {
      step,
      currentForm: _forms[step],
      getForm: ((s: number) => _forms[s]) as IWizardFormContext<T>["getForm"],
      formState: _forms[step].formState,
      isValid: _forms[step].formState.isValid,
      isLastStep,
      resetAll,
      values,
    };

    const handleNextStep = () => {
      _forms[step].handleSubmit(async data => {
        const res = wizards[step].handleSubmit?.(data, context);

        onChange?.(v => ({ ...v, ...data }));
        update(v => ({ ...v, ...data }));

        const skipNext =
          res === false || (isPromise(res) && (await res) === false);

        if (skipNext) {
          return;
        }

        if (isLastStep) {
          handleSubmit({ ...values, ...data }, context);
        } else {
          nextStep();
        }
      })();
    };

    return {
      ...context,
      nextStep: handleNextStep,
      prevStep,
    };
  }, [
    // Важно пересчитывать все по изменению formState
    // eslint-disable-next-line react-hooks/exhaustive-deps
    _forms[step].formState,
    step,
    wizards,
    _forms,
    values,
    prevStep,
    reset,
    onChange,
    handleSubmit,
    nextStep,
  ]);

  return (
    <WizardFormContext.Provider value={providerValue}>
      <RenderHeader {...providerValue} />
      <Form
        key={`wizard-form-${key}`}
        values={values}
        {...rest}
        fields={fields}
        form={_forms[step]}
      />
      <RenderFooter {...providerValue} />
    </WizardFormContext.Provider>
  );
};

export const WizardForm = memo(_WizardForm) as typeof _WizardForm;

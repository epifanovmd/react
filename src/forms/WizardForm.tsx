import React, {
  memo,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FieldValues, useForm } from "react-hook-form";

import { Form } from "./Form";
import { useStep, WizardFormContext } from "./hooks";
import { IWizardActions, IWizardFormContext, IWizardFormProps } from "./types";

const _WizardForm = <T extends FieldValues>({
  wizards,
  renderHeader: RenderHeader = () => null,
  renderFooter: RenderFooter = () => null,
  onSubmit: handleSubmit,
}: PropsWithChildren<IWizardFormProps<T>>) => {
  const [step, nextStep, prevStep] = useStep(0, wizards.length - 1);
  const [values, setValues] = useState<T>({} as T);

  useEffect(() => {
    const { unsubscribe } = _forms[step].watch(value => {
      setValues(oldValues => ({ ...oldValues, ...value }));
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const _forms = useRef(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    wizards.map(({ formProps }) => useForm(formProps)),
  ).current;

  const { name, formProps, fields: _fields, ...rest } = wizards[step];

  const { fields, providerValue } = useMemo(() => {
    const isLastStep = step === wizards.length - 1;

    const resetAll = () => {
      wizards.forEach((_, index) => {
        _forms[index].reset();
      });
    };

    const context: Omit<IWizardFormContext<T>, keyof IWizardActions> = {
      step,
      values,
      currentForm: _forms[step],
      getForm: ((s: number) => _forms[s]) as IWizardFormContext<T>["getForm"],
      formState: _forms[step].formState,
      isValid: _forms[step].formState.isValid,
      isLastStep,
      resetAll,
    };

    const handleNextStep = () => {
      _forms[step].handleSubmit(data => {
        wizards[step].handleSubmit(data, context);
        setValues(v => ({ ...data, ...v }));

        if (isLastStep) {
          handleSubmit({ ...data, ...values });
        } else {
          nextStep();
        }
      })();
    };

    const fields = typeof _fields === "function" ? _fields(context) : _fields;

    const providerValue = { ...context, nextStep: handleNextStep, prevStep };

    return {
      fields,
      providerValue,
    };
  }, [
    // Важно пересчитывать все по изменению formState
    // eslint-disable-next-line react-hooks/exhaustive-deps
    _forms[step].formState,
    _forms,
    _fields,
    handleSubmit,
    nextStep,
    prevStep,
    step,
    values,
    wizards,
  ]);

  return (
    <WizardFormContext.Provider value={providerValue}>
      <RenderHeader {...providerValue} />
      <Form
        key={`wizard-form-${name}`}
        {...rest}
        fields={fields}
        form={_forms[step]}
      />
      <RenderFooter {...providerValue} />
    </WizardFormContext.Provider>
  );
};

export const WizardForm = memo(_WizardForm) as typeof _WizardForm;

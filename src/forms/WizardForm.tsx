import React, {
  createContext,
  memo,
  PropsWithChildren,
  useContext,
  useRef,
} from "react";
import {
  FieldValues,
  useForm,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form";

import { Form, IFormProps } from "./Form";
import { useWizardStep } from "./hooks";

export interface IWizardActions {
  nextStep: () => void;
  prevStep: () => void;
  onSubmit: () => void;
}

export interface IWizardFormContext<T extends FieldValues = FieldValues>
  extends IWizardActions {
  step: number;
  currentForm: UseFormReturn<T>;
  getForm: <TT extends T = T>(step: number) => UseFormReturn<TT>;
  isValid: boolean;
  isLastStep: boolean;
}

const WizardFormContext = createContext<IWizardFormContext<any>>({} as any);

export type IWizard<T extends FieldValues = FieldValues> = Omit<
  IFormProps<T>,
  "form" | "fields"
> & {
  name: string;
  fields:
    | IFormProps<T>["fields"]
    | ((
        context: Omit<IWizardFormContext<T>, keyof IWizardActions>,
      ) => IFormProps<T>["fields"]);
  formProps: UseFormProps<T>;
  handleSubmit: (
    data: T,
    context: Omit<IWizardFormContext<T>, keyof IWizardActions>,
  ) => void;
};

export interface IWizardFormProps<T extends FieldValues = FieldValues> {
  wizards: IWizard<T>[];
  renderHeader?: (context: IWizardFormContext<T>) => React.ReactElement | null;
  renderFooter?: (context: IWizardFormContext<T>) => React.ReactElement | null;
}

const _WizardForm = <T extends FieldValues>({
  wizards,
  renderHeader: RenderHeader = () => null,
  renderFooter: RenderFooter = () => null,
}: PropsWithChildren<IWizardFormProps<T>>) => {
  const [step, nextStep, prevStep] = useWizardStep(0, wizards.length - 1);

  const _forms = useRef(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    wizards.map(({ formProps }) => useForm(formProps)),
  ).current;

  const { name, formProps, fields: _fields, ...rest } = wizards[step];

  const context = {
    step,
    currentForm: _forms[step],
    getForm: ((s: number) => _forms[s]) as IWizardFormContext<T>["getForm"],
    isValid: _forms[step].formState.isValid,
    isLastStep: step === wizards.length - 1,
  };

  const onSubmit = () => {
    _forms[step].handleSubmit(data => {
      wizards[step].handleSubmit(data, context);
      nextStep();
    })();
  };

  const fields = typeof _fields === "function" ? _fields(context) : _fields;

  const providerValue = { ...context, nextStep, prevStep, onSubmit };

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

export const useWizardForm = <T extends FieldValues>() => {
  return useContext<IWizardFormContext<T> & IWizardActions>(
    WizardFormContext as any,
  );
};

export const WizardForm = memo(_WizardForm) as typeof _WizardForm;

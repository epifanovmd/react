import React from "react";
import {
  ControllerProps,
  FieldValues,
  FormState,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form";

export type TFieldRender<T extends FieldValues = FieldValues> = (
  field: Parameters<ControllerProps<T>["render"]>[0] & {
    form: UseFormReturn<T>;
  },
) => React.ReactElement | null;

export interface IFormField<T extends FieldValues = FieldValues>
  extends Omit<ControllerProps<T>, "control" | "render"> {
  render?: TFieldRender<T>;
}

export type TRenderFieldLayout<T extends FieldValues = FieldValues> = (
  children: React.ReactNode,
  field: Parameters<ControllerProps<T>["render"]>[0],
) => React.ReactElement;

export interface IFormProps<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>;
  fields: IFormField<T>[];
  renderFieldLayout?: TRenderFieldLayout<T>;
}

export interface IWizardActions {
  nextStep: () => void;
  prevStep: () => void;
}

export interface IWizardFormContext<T extends FieldValues = FieldValues>
  extends IWizardActions {
  step: number;
  currentForm: UseFormReturn<T>;
  getForm: <TT extends T = T>(step: number) => UseFormReturn<TT>;
  formState: FormState<T>;
  isValid: boolean;
  isLastStep: boolean;
  values: T;
  resetAll: () => void;
}

export type TWizardFields<T extends FieldValues = FieldValues> =
  | IFormProps<T>["fields"]
  | ((
      context: Omit<IWizardFormContext<T>, keyof IWizardActions>,
    ) => IFormProps<T>["fields"]);

export type TWizardHandleSubmit<T extends FieldValues = FieldValues> = (
  data: T,
  context: Omit<IWizardFormContext<T>, keyof IWizardActions>,
) => void;

export type IWizard<T extends FieldValues = FieldValues> = Omit<
  IFormProps<T>,
  "form" | "fields"
> & {
  name: string;
  fields: TWizardFields<T>;
  formProps: UseFormProps<T>;
  handleSubmit: TWizardHandleSubmit<T>;
};

export interface IWizardFormProps<T extends FieldValues = FieldValues> {
  wizards: IWizard<T>[];
  onSubmit: (values: T) => void;
  renderHeader?: (context: IWizardFormContext<T>) => React.ReactElement | null;
  renderFooter?: (context: IWizardFormContext<T>) => React.ReactElement | null;
}

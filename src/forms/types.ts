import React from "react";
import {
  ControllerFieldState,
  ControllerProps,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  FormState,
  UseFormProps,
  UseFormReturn,
  UseFormStateReturn,
} from "react-hook-form";

export interface IFormField<
  T extends FieldValues = FieldValues,
  TName extends keyof T = keyof T,
> {
  title?: string;
  field: Omit<ControllerRenderProps<T>, "value"> & {
    value: T[TName];
  };
  values: T;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<T>;
  form: UseFormReturn<T>;
}

export type TFieldRender<
  T extends FieldValues = FieldValues,
  TName extends keyof T = keyof T,
> = (field: IFormField<T, TName>) => React.ReactNode;

export interface IFormFieldItem<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
> extends Omit<ControllerProps<T, TName>, "control" | "render"> {
  title?: string;
  render?: TFieldRender<T, TName>;
}

export type TRenderFieldLayout<T extends FieldValues = FieldValues> = (
  children: React.ReactNode,
  field: IFormField<T>,
) => React.ReactElement;

export interface IFormProps<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
> {
  form: UseFormReturn<T>;
  fields: IFormFieldItem<T, TName>[];
  renderFieldLayout?: TRenderFieldLayout<T>;
  values?: T;
}

export interface IWizardActions {
  nextStep: () => void;
  prevStep: () => void;
}

export interface IWizardFormContext<T extends FieldValues = FieldValues>
  extends IWizardActions {
  step: number;
  values: T;
  currentForm: UseFormReturn<T>;
  getForm: <TT extends T = T>(step: number) => UseFormReturn<TT>;
  formState: FormState<T>;
  isValid: boolean;
  isLastStep: boolean;
  resetAll: () => void;
}

export type TWizardFields<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
> = IFormProps<T, TName>["fields"];

export type TWizardHandleSubmit<T extends FieldValues = FieldValues> = (
  data: T,
  context: Omit<IWizardFormContext<T>, keyof IWizardActions>,
) => void | false | Promise<false | void>;

export type IWizard<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
> = Omit<IFormProps<T>, "form" | "fields" | "values"> & {
  key: string;
  fields: TWizardFields<T, TName>;
  params: ((values: T) => UseFormProps<T>) | UseFormProps<T>;
  handleSubmit?: TWizardHandleSubmit<T>;
};

export interface IWizardFormProps<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
> {
  wizards: IWizard<T, TName>[];
  onSubmit: (
    values: T,
    context: Omit<IWizardFormContext<T>, keyof IWizardActions>,
  ) => void;
  onChange?: (values: T | ((values: T) => T)) => void;
  renderHeader?: (context: IWizardFormContext<T>) => React.ReactElement | null;
  renderFooter?: (context: IWizardFormContext<T>) => React.ReactElement | null;
}

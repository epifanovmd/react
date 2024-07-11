import { createContext, useContext } from "react";
import { FieldValues } from "react-hook-form";

import { IWizardFormContext } from "../types";

const error = new Error("WizardFormContext was not provided");

export const WizardFormContext = createContext<IWizardFormContext<any>>({
  getForm: () => {
    throw error;
  },
  isLastStep: false,
  isValid: false,
  nextStep: () => {
    throw error;
  },
  prevStep: () => {
    throw error;
  },
  step: 0,
  currentForm: undefined as any,
  values: {},
  formState: {} as any,
  resetAll: () => {
    throw error;
  },
});

export const useWizardFormContext = <T extends FieldValues>() => {
  return useContext<IWizardFormContext<T>>(WizardFormContext as any);
};

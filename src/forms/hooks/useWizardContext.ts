import { createContext, useContext } from "react";
import { FieldValues } from "react-hook-form";

import { IWizardProps } from "../Wizard";

export interface IWizardContext<T extends FieldValues = FieldValues>
  extends IWizardProps<T> {}

export const WizardContext = createContext<IWizardContext<any>>(
  undefined as any,
);

export const useWizardContext = <T extends FieldValues = FieldValues>() => {
  return useContext<IWizardContext<T>>(WizardContext);
};

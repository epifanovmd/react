import React, { FC, memo, PropsWithChildren } from "react";
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form";

import { IUseWizardReturn, WizardContext } from "./hooks";

export interface IWizardProps<T extends FieldValues = FieldValues>
  extends IUseWizardReturn<T> {}

export interface IWizardStepProps<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>;
  step: number;
}

export interface IWizard {
  Step: FC<PropsWithChildren<IWizardStepProps>>;

  (props: PropsWithChildren<IWizardProps>): React.ReactElement | null;
}

const _Wizard: FC<PropsWithChildren<IUseWizardReturn>> = ({
  children,
  ...wizard
}) => {
  const wizards = React.Children.toArray(children).filter(child => {
    if (React.isValidElement(child)) {
      return (
        (child.type as React.FC)?.displayName !== "WizardStep" ||
        ((child.type as React.FC)?.displayName === "WizardStep" &&
          child.props.step === wizard.step)
      );
    }

    return false;
  });

  return (
    <WizardContext.Provider value={wizard}>{wizards}</WizardContext.Provider>
  );
};

const WizardStep: FC<PropsWithChildren<IWizardStepProps>> = memo(
  ({ form, children }) => {
    return <FormProvider {...form}>{children}</FormProvider>;
  },
);

export const Wizard = memo(_Wizard) as any as IWizard;

WizardStep.displayName = "WizardStep";
Wizard.Step = WizardStep;

import { useCallback, useState } from "react";

export const useWizardStep = (
  defaultStep: number = 0,
  maxStep: number = 0,
): [number, () => void, () => void] => {
  const [step, setStep] = useState(defaultStep);

  const nextStep = useCallback(() => {
    setStep(s => (s < maxStep ? s + 1 : maxStep));
  }, [maxStep]);
  const prevStep = useCallback(() => {
    setStep(s => (s > 0 ? s - 1 : 0));
  }, []);

  return [step, nextStep, prevStep];
};

import { useCallback, useState } from "react";

export const useStep = (
  defaultStep: number = 0,
  maxStep: number = Number.MAX_SAFE_INTEGER,
): [number, () => void, () => void, () => void] => {
  const [step, setStep] = useState(defaultStep);

  const nextStep = useCallback(() => {
    setStep(s => (s < maxStep ? s + 1 : maxStep));
  }, [maxStep]);

  const prevStep = useCallback(() => {
    setStep(s => (s > 0 ? s - 1 : 0));
  }, []);

  const reset = useCallback(() => {
    setStep(defaultStep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [step, nextStep, prevStep, reset];
};

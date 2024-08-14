import { RefinementCtx } from "zod";
import { SafeParseReturnType } from "zod/lib/types";

export const validateWithCtx = <Input, Output>(
  ctx: RefinementCtx,
  validate: SafeParseReturnType<Input, Output>,
) => {
  if (validate.error) {
    validate.error.issues.forEach(issue => {
      ctx.addIssue(issue);
    });
  }
};

import type { BinderReturn } from '@formula/core-types';
import type { Observable } from 'rxjs';

export type ValidateFn = (v: unknown) => string | undefined | Promise<string | undefined>;
export type ValidationBinders = {
  validateField: (a: ValidateFn[]) => BinderReturn;
  stepDisabled: () => BinderReturn;
};
export type ValidationState = {
  rx: Observable<InnerState>;
  validate: (a: ValidateArgs) => void;
};
export type InnerState = Record<string, string[]>;
export type ValidateArgs = {
  name: string;
  errors: string[];
};

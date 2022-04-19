import type { TBase } from '@formula/core';
import type { Observable } from 'rxjs';

export type ValidateFn = (v: unknown) => string | undefined | Promise<string | undefined>;
export type ValidationBinders = {
  validateField: (a: ValidateFn[]) => TBase.BinderReturn;
  stepDisabled: () => TBase.BinderReturn;
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

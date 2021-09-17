import type { Observable } from 'rxjs';

export type ValidateFn = (v: unknown) => string | undefined | Promise<string | undefined>;
export type ValidationService = {
  useBinders: {
    validateField: (a: ValidateFn[]) => (fe: string) => void;
    stepDisabled: () => (fe: string) => void;
  };
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

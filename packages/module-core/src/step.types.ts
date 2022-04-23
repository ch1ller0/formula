import { Observable } from 'rxjs';
import type { Atom } from '@reatom/core';
import type { BinderReturn } from '@formula/core-types';

export type StepState = {
  currentStep: number;
  blocked: Record<number, boolean>;
};

export type SetBlockArgs = { stepNum: string; value: boolean };

export type StepService = {
  getRxStore: () => Observable<StepState>;
  stepBlock(args: SetBlockArgs): void;
  stepIncrement(): void;
  _getRenderDeps(): {
    atom: Atom<StepState>;
  };
};

export type StepBinders = {
  nextStep: () => BinderReturn;
};

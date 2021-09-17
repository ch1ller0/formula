import type { Atom } from '@reatom/core';
import type { BinderReturn } from '../../types/base.types';

export type StepState = {
  currentStep: number;
  blocked: Record<number, boolean>;
};

export type SetBlockArgs = { stepNum: string; value: boolean };

export type StepService = {
  setBlocked(args: SetBlockArgs): void;
  _getRenderDeps(): {
    atom: Atom<StepState>;
  };
  useBinders: {
    nextStep: () => BinderReturn;
  };
};

import type { Atom } from '@reatom/core';
import type { TProviderService } from '../../types/provider.types';

export type StepState = {
  currentStep: number;
  blocked: Record<number, boolean>;
};

export type SetBlockArgs = { stepNum: string; value: boolean };

export interface StepFactory extends TProviderService {
  setBlocked(args: SetBlockArgs): void;
  _getRenderDeps(): {
    atom: Atom<StepState>;
  };
}

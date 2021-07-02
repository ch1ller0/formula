import type { Atom } from '@reatom/core';
import type { TProviderService } from '../../types/provider.types';

export type StepState = {
  currentStep: number;
  blocked: Record<number, boolean>;
};

export type SetBlockArgs = { stepNum: string; value: boolean };

export interface TStepService extends TProviderService {
  setBlocked(args: SetBlockArgs): void;
  findFields(name: string): [string, string[] | undefined] | undefined;
  _getRenderDeps(): {
    atom: Atom<StepState>;
  };
}

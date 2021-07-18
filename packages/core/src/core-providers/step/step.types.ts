import type { Atom } from '@reatom/core';
import type { Observable } from 'rxjs';
import type { TProviderService } from '../../types/provider.types';

export type StepState = {
  currentStep: number;
  blocked: Record<number, boolean>;
};

export type SetBlockArgs = { stepNum: string; value: boolean };

export interface TStepService extends TProviderService {
  setBlocked(args: SetBlockArgs): void;
  getCurrentScreenFields(fieldName: string): Observable<string[]>;
  _getRenderDeps(): {
    atom: Atom<StepState>;
  };
}

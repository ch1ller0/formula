import type { Observable } from 'rxjs';
import type { Atom } from '@reatom/core';
import type { TProviderService } from '../../types/provider.types';
import type { TPrimitive } from '../../types/base.types';

export type FieldState = Record<string, TPrimitive>;
export type ChangeKeyValArgs = {
  name: string;
  value: TPrimitive;
};

export interface TFieldService extends TProviderService {
  getRxStore(): Observable<FieldState>;
  getDiffRx: () => Observable<Partial<FieldState>>;
  _getRenderDeps(): {
    atom: Atom<FieldState>;
    setValue(args: ChangeKeyValArgs): void;
  };
}

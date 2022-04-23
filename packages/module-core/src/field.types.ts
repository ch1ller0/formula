import type { Observable } from 'rxjs';
import type { Atom } from '@reatom/core';
import type { Primitive } from '@formula/core-types';

export type FieldState = Record<string, Primitive>;
export type ChangeKeyValArgs = {
  name: string;
  value: Primitive;
};

export type FieldService = {
  getRxStore(): Observable<FieldState>;
  getDiffRx(): Observable<Partial<FieldState>>;
  _getRenderDeps(): {
    atom: Atom<FieldState>;
    setValue(args: ChangeKeyValArgs): void;
  };
};

import type { Observable } from 'rxjs';
import type { Atom } from '@reatom/core';
import type { Primitive } from '@formula/core-types';

export type FieldState = Record<string, Primitive>;

export type SetFieldValueArgs = {
  fieldName: string;
  value: Primitive;
};

type FieldActions = {
  setFieldValue: (fieldName: string, value: Primitive) => void;
};

export type FieldService = {
  getRxStore(): Observable<FieldState>;
  getDiffRx(): Observable<SetFieldValueArgs>;
} & FieldActions;

export type FieldStore = {
  atom: Atom<FieldState>;
  actions: FieldActions;
  diffRx: Observable<SetFieldValueArgs>;
};

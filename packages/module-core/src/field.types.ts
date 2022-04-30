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

type ObservablePipe<I, O> = (input: Observable<I>) => Observable<O>;

export type FieldService = {
  getRxStore(): Observable<FieldState>;
  getDiffRx(): Observable<SetFieldValueArgs>;
  selectors: { getClicks: (args: { fieldName: string }) => ObservablePipe<FieldState, string> };
} & FieldActions;

export type FieldStore = {
  atom: Atom<FieldState>;
  actions: FieldActions;
  diffRx: Observable<SetFieldValueArgs>;
};

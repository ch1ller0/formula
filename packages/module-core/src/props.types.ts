import type { Atom } from '@reatom/core';

export type Props = Record<string, unknown>;
export type PropsState = Record<string, Props>;

type PropsActions = {
  setFieldProps(fieldName: string, props: Props): void;
};

export type PropsStore = {
  atom: Atom<PropsState>;
  actions: PropsActions;
};

export type PropsService = PropsActions;

import type { Atom } from '@reatom/core';

export type Props = Record<string, unknown>;
export type PropsState = Record<string, Props>;

export type ChangeFieldPropsArgs = {
  name: string;
  value: Props;
};

export type PropsService = {
  setFieldProp(name: string, value: Props): void;
  _getRenderDeps(): {
    atom: Atom<PropsState>;
  };
};

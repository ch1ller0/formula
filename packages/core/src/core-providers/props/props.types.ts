import type { Atom } from '@reatom/core';
import type { TProviderService } from '../../types/provider.types';

export type Props = Record<string, unknown>;
export type PropsState = Record<string, Props>;

export type ChangeFieldPropsArgs = {
  name: string;
  value: Props;
};

export interface TPropsService extends TProviderService {
  setFieldProp(name: string, value: Props): void;
  _getRenderDeps(): {
    atom: Atom<PropsState>;
  };
}

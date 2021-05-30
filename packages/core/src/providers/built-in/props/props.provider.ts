import { useState, Props } from './props.state';

import type {
  TProviderConfig,
  TProviderService,
  TProviderConsturctorArgs,
} from '../../../types/provider.types';

class PropsService implements TProviderService {
  private readonly _selfState: ReturnType<typeof useState>;

  constructor(args: TProviderConsturctorArgs) {
    this._selfState = useState(args);
  }

  setFieldProp(name: string, value: Props) {
    this._selfState.actions.changeFieldProps({ name, value });
  }

  getAtom() {
    return this._selfState._atom;
  }

  getRxStore() {
    return this._selfState.rx;
  }
}

export const PropsProvider: TProviderConfig<PropsService> = {
  name: 'props',
  useService: PropsService,
};

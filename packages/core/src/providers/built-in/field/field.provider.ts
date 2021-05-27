import { FieldsFactory } from './field.gen';
import { PropsProvider } from '../';
import { useState } from './field.state';

import type {
  TProviderConfig,
  TProviderService,
  TProviderConsturctorArgs,
  TToProviderInstance,
} from '../../../types/provider.types';

class FieldService implements TProviderService {
  private readonly _propsService: TToProviderInstance<typeof PropsProvider>;
  private readonly _selfState: ReturnType<typeof useState>;

  constructor(args: TProviderConsturctorArgs) {
    const [propsService] = args.deps;
    this._propsService = propsService;
    this._selfState = useState(args);
  }

  getRxStore() {
    return this._selfState.rx;
  }

  renderWrapper() {
    return FieldsFactory({
      atom: this._selfState._atom,
      actions: this._selfState._actions,
      propsAtom: this._propsService.getAtom(),
    });
  }
}

export const FieldProvider: TProviderConfig<FieldService> = {
  name: 'field',
  useService: FieldService,
  deps: [PropsProvider],
};

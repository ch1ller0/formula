import { useState } from './structure.state';

import type {
  TProviderConfig,
  TProviderService,
  TProviderConsturctorArgs,
} from '../../../types/provider.types';
import type { StructureFactory } from './structure.types';

type SelfDeps = {
  factory: StructureFactory;
};

class StructureService implements TProviderService {
  private readonly _selfState: ReturnType<typeof useState>;

  constructor(args: TProviderConsturctorArgs, deps: SelfDeps) {
    this._selfState = useState({ ...args, factory: deps.factory });
  }

  getRxStore() {
    return this._selfState.rx;
  }

  useBinders() {
    return {};
  }

  _getRenderDeps() {
    return this._selfState;
  }

  _getInitialState() {
    return this._selfState.initial;
  }
}

export const StructureProvider: TProviderConfig<StructureService> = {
  name: 'structure',
  useService: StructureService,
};

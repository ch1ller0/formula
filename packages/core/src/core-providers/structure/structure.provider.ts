import { useState } from './structure.state';

import type {
  TProviderConfig,
  TProviderConsturctorArgs,
} from '../../types/provider.types';
import type { StructureFactory, TStructureService } from './structure.types';

type SelfDeps = {
  factory: StructureFactory;
};

class StructureService implements TStructureService {
  private readonly _selfState: ReturnType<typeof useState>;

  constructor(args: TProviderConsturctorArgs<[]>, deps: SelfDeps) {
    // @TODO move to initial config provider
    this._selfState = useState({ ...args, factory: deps.factory });
  }

  getRxStore() {
    return this._selfState.rx;
  }

  useBinders() {
    return {};
  }

  _getRenderDeps() {
    return { atom: this._selfState._atom };
  }

  _getInitialState() {
    return this._selfState.initial;
  }

  _getInitialConfig() {
    return this._selfState.initialConfig;
  }
}

export const StructureProvider: TProviderConfig<StructureService> = {
  name: 'structure',
  useService: StructureService,
  deps: [],
};

import { useState } from './structure.state';

import type {
  TProviderConfig,
  TProviderConsturctorArgs,
} from '../../types/provider.types';
import {
  StructureFactory,
  TStructureService,
  GroupStructKey,
} from './structure.types';

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

  _getRenderDeps() {
    return { atom: this._selfState._atom };
  }

  _getInitialState() {
    return this._selfState.initialState;
  }

  toggleGroupsVisibility(groupNames: GroupStructKey[]) {
    this._selfState.actions.toggleGroupVisibilityAction({
      groupKeys: groupNames,
    });
  }
}

export const StructureProvider: TProviderConfig<StructureService> = {
  name: 'structure',
  useService: StructureService,
  deps: [],
};

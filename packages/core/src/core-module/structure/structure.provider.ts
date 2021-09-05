import { STRUCTURE_CONFIG_TOKEN, STRUCTURE_SERVICE_TOKEN, GLOBAL_STORE_TOKEN } from '../tokens';
import { useState } from './structure.state';
import type { Provider } from '@formula/ioc';
import type { GlobalStore } from '../global-store/global-store.types';

import type { StructureFactory, TStructureService, GroupStructKey } from './structure.types';

class StructureService implements TStructureService {
  private readonly _selfState: ReturnType<typeof useState>;

  constructor(deps: [StructureFactory, GlobalStore]) {
    const [factory, globalStore] = deps;
    // @TODO move to initial config provider
    this._selfState = useState({ globalStore, factory });
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

export const structureProvider: Provider = {
  provide: STRUCTURE_SERVICE_TOKEN,
  useClass: StructureService,
  deps: [STRUCTURE_CONFIG_TOKEN, GLOBAL_STORE_TOKEN],
};

import { STRUCTURE_CONFIG_TOKEN, STRUCTURE_SERVICE_TOKEN, GLOBAL_STORE_TOKEN } from '../tokens';
import { useState } from './structure.state';
import { selectors } from './structure.selector';
import type { ExtractToken, Provider } from '@formula/ioc';
import type { StructureService, GroupStructKey } from './structure.types';

const structureFactory = (
  deps: [ExtractToken<typeof STRUCTURE_CONFIG_TOKEN>, ExtractToken<typeof GLOBAL_STORE_TOKEN>],
) => {
  const [factory, globalStore] = deps;
  // @TODO move to initial config provider
  const selfState = useState({ globalStore, factory });

  return {
    getRxStore: () => selfState.rx,
    toggleGroupsVisibility: (groupNames: GroupStructKey[]) => {
      selfState.actions.toggleGroupVisibilityAction({
        groupKeys: groupNames,
      });
    },
    _getRenderDeps: () => ({ atom: selfState._atom }),
    _getInitialState: () => selfState.initialState,
    selectors,
  };
};

const structureProvider: Provider<StructureService> = {
  provide: STRUCTURE_SERVICE_TOKEN,
  useFactory: structureFactory,
  deps: [STRUCTURE_CONFIG_TOKEN, GLOBAL_STORE_TOKEN],
};

export const StructureModule = [structureProvider];

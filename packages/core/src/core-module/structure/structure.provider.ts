import { injectable } from '@fridgefm/inverter';
import { STRUCTURE_CONFIG_TOKEN, STRUCTURE_SERVICE_TOKEN, GLOBAL_STORE_TOKEN } from '../tokens';
import { useState } from './structure.state';
import { selectors } from './structure.selector';
import type { TokenProvide } from '@fridgefm/inverter';
import type { GroupStructKey } from './structure.types';

const structureFactory = (
  factory: TokenProvide<typeof STRUCTURE_CONFIG_TOKEN>,
  globalStore: TokenProvide<typeof GLOBAL_STORE_TOKEN>,
) => {
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

export const structureProviders = [
  injectable({
    provide: STRUCTURE_SERVICE_TOKEN,
    useFactory: structureFactory,
    inject: [STRUCTURE_CONFIG_TOKEN, GLOBAL_STORE_TOKEN] as const,
  }),
];

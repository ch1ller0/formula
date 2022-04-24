import { injectable } from '@fridgefm/inverter';
import { declareAction, declareAtom } from '@reatom/core';
import noop from '@tinkoff/utils/function/noop';
import { STRUCTURE_CONFIG_TOKEN, STRUCTURE_SERVICE_TOKEN, GLOBAL_STORE_TOKEN, STRUCTURE_STORE_TOKEN } from './tokens';
import { selectors } from './structure.selector';
import { toRxStore } from './state.util';
import { getInitialStructure, normalizate } from './structure.util';
import type { GroupStructKey, StructureState, GroupStructVal } from './structure.types';

type ToggleGroupVisibilityArgs = {
  groupKeys: GroupStructKey[];
};

export const structureProviders = [
  injectable({
    provide: STRUCTURE_STORE_TOKEN,
    useFactory: (structureConfig, globalStore) => {
      const initialConfig = getInitialStructure(structureConfig);
      const normalizedState = normalizate(initialConfig);
      const toggleGroupVisibilityAction = declareAction<ToggleGroupVisibilityArgs>('structure.toggle-group-visiblity');

      const atom = declareAtom<StructureState>(['structure'], normalizedState, (on) => [
        on(toggleGroupVisibilityAction, (state, { groupKeys }) => {
          const part = groupKeys.reduce((acc, groupKey) => {
            const prevGroupState = state.groups[groupKey] as GroupStructVal;
            const opts = {
              ...prevGroupState.opts,
              invisible: !prevGroupState.opts.invisible,
            };

            return { ...acc, [groupKey]: { ...prevGroupState, opts } };
          }, {});

          return { ...state, groups: { ...state.groups, ...part } };
        }),
      ]);

      globalStore.subscribe(atom, noop);

      return {
        atom,
        actions: {
          toggleGroupsVisibility: (groupKeys) => {
            globalStore.dispatch(toggleGroupVisibilityAction({ groupKeys }));
          },
        },
        initialState: normalizedState,
      };
    },
    inject: [STRUCTURE_CONFIG_TOKEN, GLOBAL_STORE_TOKEN] as const,
  }),
  injectable({
    provide: STRUCTURE_SERVICE_TOKEN,
    useFactory: (structureStore, globalStore) => {
      const rxStore = toRxStore(globalStore, structureStore.atom);

      return { ...structureStore.actions, selectors, getRxStore: () => rxStore };
    },
    inject: [STRUCTURE_STORE_TOKEN, GLOBAL_STORE_TOKEN] as const,
  }),
];

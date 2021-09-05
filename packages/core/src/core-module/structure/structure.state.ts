import { declareAction, declareAtom } from '@reatom/core';
import noop from '@tinkoff/utils/function/noop';
import { toRxStore } from '../../utils/state.util';
import { getInitialStructure, normalizate } from './structure.util';

import type { Store } from '@reatom/core';
import type {
  StructureFactory,
  StructureState,
  GroupStructKey,
  GroupStructVal,
} from './structure.types';

type ToggleGroupVisibilityArgs = {
  groupKeys: GroupStructKey[];
};

const toggleGroupVisibilityAction = declareAction<ToggleGroupVisibilityArgs>(
  'structure.toggle-group-visiblity',
);

export const useState = ({
  globalStore,
  factory,
}: {
  globalStore: Store;
  factory: StructureFactory;
}) => {
  const initialConfig = getInitialStructure(factory);
  const normalizedState = normalizate(initialConfig);
  const atom = declareAtom<StructureState>(
    ['structure'],
    normalizedState,
    (on) => [
      on(toggleGroupVisibilityAction, (state, { groupKeys }) => {
        const part = groupKeys.reduce((acc, groupKey) => {
          // @ts-ignore
          const prevGroupState = state.groups[groupKey] as GroupStructVal;
          const opts = {
            ...prevGroupState.opts,
            invisible: !prevGroupState.opts.invisible,
          };

          return { ...acc, [groupKey]: { ...prevGroupState, opts } };
        }, {});

        return { ...state, groups: { ...state.groups, ...part } };
      }),
    ],
  );

  globalStore.subscribe(atom, noop);

  return {
    _atom: atom,
    _getState: () => globalStore.getState(atom),
    actions: {
      toggleGroupVisibilityAction: (a: ToggleGroupVisibilityArgs) =>
        globalStore.dispatch(toggleGroupVisibilityAction(a)),
    },
    rx: toRxStore(globalStore, atom),
    initialState: normalizedState,
  };
};

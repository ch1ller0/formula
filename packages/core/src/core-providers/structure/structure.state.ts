import { declareAction, declareAtom } from '@reatom/core';
import { toRxStore } from '../../base/store';
import { getInitialStructure, normalizate } from './structure.util';

import type { Store } from '@reatom/core';
import type { StructureFactory, NormalizedStructure } from './structure.types';

type ToggleGroupVisibilityArgs = {
  groupName: string;
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
  const atom = declareAtom<NormalizedStructure>(
    ['structure'],
    normalizedState,
    (on) => [],
  );

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

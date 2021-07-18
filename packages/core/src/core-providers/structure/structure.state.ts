import { declareAction, declareAtom } from '@reatom/core';
import { map, shareReplay } from 'rxjs/operators';
import { toRxStore } from '../../base/store';
import {
  toFieldsObj,
  getInitialStructure,
  normalizate,
} from './structure.util';

import type { Store } from '@reatom/core';
import type { FormStructure, StructureFactory } from './structure.types';

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
  const atom = declareAtom<FormStructure>(
    ['structure'],
    initialConfig,
    (on) => [],
  );

  console.log('initialConfig', initialConfig);

  console.log('noemlizd', normalizate(initialConfig));

  return {
    _atom: atom,
    actions: {
      toggleGroupVisibilityAction: (a: ToggleGroupVisibilityArgs) =>
        globalStore.dispatch(toggleGroupVisibilityAction(a)),
    },
    rx: toRxStore(globalStore, atom).pipe(map(toFieldsObj), shareReplay()),
    initialState: toFieldsObj(initialConfig),
    initialConfig: initialConfig,
  };
};

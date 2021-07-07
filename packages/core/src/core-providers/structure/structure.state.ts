import { declareAtom } from '@reatom/core';
import noop from '@tinkoff/utils/function/noop';
import { map, shareReplay } from 'rxjs/operators';
import { toRxStore } from '../../base/store';
import { toFieldsObj, getInitialState } from './structure.util';

import type { Store } from '@reatom/core';
import type { FormStructure, StructureFactory } from './structure.types';

export const useState = ({
  globalStore,
  factory,
}: {
  globalStore: Store;
  factory: StructureFactory;
}) => {
  const initialConfig = getInitialState(factory);
  const atom = declareAtom<FormStructure>(
    ['structure'],
    initialConfig,
    () => [],
  );

  globalStore.subscribe(atom, noop);

  return {
    _atom: atom,
    rx: toRxStore(globalStore, atom).pipe(map(toFieldsObj), shareReplay()),
    initialState: toFieldsObj(initialConfig),
    initialConfig: initialConfig,
  };
};

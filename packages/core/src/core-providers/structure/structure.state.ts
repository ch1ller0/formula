import { declareAtom } from '@reatom/core';
import noop from '@tinkoff/utils/function/noop';
import toPairs from '@tinkoff/utils/object/toPairs';
import { map, shareReplay } from 'rxjs/operators';
import { toRxStore } from '../../base/store';

export const toFieldsObj = (obj: FormStructure) => {
  const flattened = {};

  const extractFields = (str: FormStructure) =>
    toPairs(str).forEach(([key, value]) => {
      if ('group' in value) {
        return extractFields(value.group);
      }
      flattened[key] = value;
    });

  extractFields(obj);
  return flattened;
};

import type { Store } from '@reatom/core';
import type { FormStructure, StructureFactory } from './structure.types';

export type State = FormStructure;

const getInitialState = (factory: StructureFactory) => {
  return factory({
    group: (a, opts) => ({
      type: 'group',
      group: a,
      opts: opts || {},
    }),
  });
};

export const useState = ({
  globalStore,
  factory,
}: {
  globalStore: Store;
  factory: StructureFactory;
}) => {
  const initialState = getInitialState(factory);
  const atom = declareAtom<State>(['structure'], initialState, () => []);

  globalStore.subscribe(atom, noop);

  return {
    _atom: atom,
    rx: toRxStore(globalStore, atom).pipe(map(toFieldsObj), shareReplay()),
    initial: toFieldsObj(initialState),
    initialConfig: initialState,
  };
};

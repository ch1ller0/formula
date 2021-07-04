import { declareAtom } from '@reatom/core';
import noop from '@tinkoff/utils/function/noop';
import values from '@tinkoff/utils/object/values';
import { map, shareReplay } from 'rxjs/operators';
import { toRxStore } from '../../base/store';

import type { Store } from '@reatom/core';
import type {
  EndStructure,
  FormStructure,
  StructureFactory,
} from './structure.types';

export type State = FormStructure;

const getInitialState = (factory: StructureFactory) => {
  return factory({
    group: (a) => ({ type: 'group', group: a }),
  });
};

const flat = (state: FormStructure): EndStructure => {
  return values(state)
    .map((a) => {
      if ('group' in a) {
        return a.group;
        // @TODO very bad implementation
      }
      return a;
    })
    .reduce((acc, cur) => {
      return {
        ...acc,
        ...cur,
      };
    }, Object.create(null));
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
    rx: toRxStore(globalStore, atom).pipe(map(flat), shareReplay()),
    initial: flat(initialState),
    initialConfig: initialState,
  };
};

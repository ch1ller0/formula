import { declareAction, declareAtom } from '@reatom/core';
import noop from '@tinkoff/utils/function/noop';
import mapObj from '@tinkoff/utils/object/map';
import filterObj from '@tinkoff/utils/object/filter';
import { toRxStore } from '../../utils/state.util';

import type { Store } from '@reatom/core';
import type { StructureState } from '../structure/structure.types';
import type { ChangeKeyValArgs, FieldState } from './field.types';

const changeKeyVal = declareAction<ChangeKeyValArgs>('field.changeKeyVal');

export const useState = ({ globalStore, structure }: { globalStore: Store; structure: StructureState }) => {
  const initialState = mapObj(({ field: { initialValue }, props }) => initialValue(props), structure.fields);

  const atom = declareAtom<FieldState>(
    ['field'],
    filterObj((value) => value !== null, initialState) as FieldState,
    (on) => [
      on(changeKeyVal, (state, payload) => {
        return {
          ...state,
          [payload.name]: payload.value,
        };
      }),
    ],
  );

  globalStore.subscribe(atom, noop);

  return {
    _atom: atom,
    rx: toRxStore(globalStore, atom),
    actions: {
      changeKeyVal: (a: ChangeKeyValArgs) => globalStore.dispatch(changeKeyVal(a)),
    },
  };
};

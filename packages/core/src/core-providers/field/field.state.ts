import { declareAction, declareAtom } from '@reatom/core';
import noop from '@tinkoff/utils/function/noop';
import mapObj from '@tinkoff/utils/object/map';
import { toRxStore } from '../../base/store';

import type { TProviderConsturctorArgs } from '../../types/provider.types';
import type { EndStructure } from '../structure/structure.types';
import type { ChangeKeyValArgs, FieldState } from './field.types';

const changeKeyVal = declareAction<ChangeKeyValArgs>('field.changeKeyVal');

export const useState = ({
  globalStore,
  structure,
}: TProviderConsturctorArgs & {
  structure: EndStructure;
}) => {
  const initialState = mapObj(
    ({ field: { initialValue }, props }) => initialValue(props),
    structure,
  );

  const atom = declareAtom<FieldState>(['field'], initialState, (on) => [
    on(changeKeyVal, (state, payload) => {
      return {
        ...state,
        [payload.name]: payload.value,
      };
    }),
  ]);

  globalStore.subscribe(atom, noop);

  return {
    _atom: atom,
    rx: toRxStore(globalStore, atom),
    actions: {
      changeKeyVal: (a: ChangeKeyValArgs) =>
        globalStore.dispatch(changeKeyVal(a)),
    },
  };
};

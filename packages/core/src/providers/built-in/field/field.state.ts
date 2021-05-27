import { declareAction, declareAtom } from '@reatom/core';
import noop from '@tinkoff/utils/function/noop';
import mapObj from '@tinkoff/utils/object/map';
import isFunction from '@tinkoff/utils/is/function';
import { toRxStore } from '../../../base/store';

import type { TProviderConsturctorArgs } from '../../../types/provider.types';
import type { TPrimitive } from '../../../types/base.types';

type State = Record<string, TPrimitive | null>;
type ChangeKeyValArgs = {
  name: string;
  value: TPrimitive;
};

const changeKeyVal = declareAction<ChangeKeyValArgs>('field.changeKeyVal');

export const useState = ({
  globalStore,
  structure,
}: TProviderConsturctorArgs) => {
  const initialState = mapObj(
    ({ field: { initialValue }, props }) =>
      isFunction(initialValue) ? initialValue(props) : initialValue,
    structure.reduce((acc, cur) => ({ ...acc, ...cur }), {}),
  );

  const atom = declareAtom<State>(['field'], initialState, (on) => [
    on(changeKeyVal, (state, payload) => ({
      ...state,
      [payload.name]: payload.value,
    })),
  ]);

  globalStore.subscribe(atom, noop);

  return {
    _atom: atom,
    rx: toRxStore(globalStore, atom),
    _actions: {
      changeKeyVal,
    },
    actions: {
      changeKeyVal: (a: ChangeKeyValArgs) =>
        globalStore.dispatch(changeKeyVal(a)),
    },
  };
};

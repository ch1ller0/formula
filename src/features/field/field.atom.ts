import { declareAction, declareAtom } from '@reatom/core';

type State = Record<string, string | number | undefined>;

export const changeAction = declareAction<{
  name: string;
  value: string | number;
}>('field-changed');

export const fieldAtom = declareAtom<State>('field.atom', {}, (on) => [
  on(changeAction, (state, payload) => ({
    ...state,
    [payload.name]: payload.value,
  })),
]);

import { declareAction, declareAtom } from '@reatom/core';

type State = Record<string, { error: string }>;

export const validateAction = declareAction<{
  name: string;
  error: string;
}>('validation-changed');

export const validationAtom = declareAtom<State>({}, (on) => [
  on(validateAction, (state, payload) => ({
    ...state,
    [payload.name]: payload.error,
  })),
]);

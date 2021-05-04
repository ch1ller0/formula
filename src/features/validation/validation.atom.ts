import { declareAction, declareAtom } from '@reatom/core';

type State = Record<string, { error: string }>;

export const validateAction = declareAction<{
  name: string;
  errors: string[];
}>('validation-changed');

export const validationAtom = declareAtom<State>(
  'validation.atom',
  {},
  (on) => [
    on(validateAction, (state, payload) => ({
      ...state,
      [payload.name]: payload.errors,
    })),
  ],
);

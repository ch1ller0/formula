import { declareAction, declareAtom, Store } from '@reatom/core';
import noop from '@tinkoff/utils/function/noop';
import { StateUtil } from '@formula/core';

type State = Record<string, string[]>;
type ValidateActionArgs = {
  name: string;
  errors: string[];
};

const validateAction = declareAction<ValidateActionArgs>(
  'validation.validateAction',
);

export const useState = (globalStore: Store) => {
  const atom = declareAtom<State>(['validation'], {}, (on) => [
    on(validateAction, (state, payload) => ({
      ...state,
      [payload.name]: payload.errors,
    })),
  ]);

  globalStore.subscribe(atom, noop);

  return {
    _atom: atom,
    rx: StateUtil.toRxStore(globalStore, atom),
    actions: {
      validateAction: (a: ValidateActionArgs) =>
        globalStore.dispatch(validateAction(a)),
    },
  };
};

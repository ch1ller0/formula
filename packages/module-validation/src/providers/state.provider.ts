import { Provider } from '@formula/ioc';
import { declareAction, declareAtom, createStore } from '@reatom/core';
import { StateUtil } from '@formula/core';
import { VALIDATION_STATE_TOKEN } from '../tokens';
import type { ValidationState, ValidateArgs, InnerState } from '../types';

export const stateProvider: Provider<ValidationState> = {
  provide: VALIDATION_STATE_TOKEN,
  useFactory: () => {
    // no need to connect it to global
    const localStore = createStore();
    const validateAction = declareAction<ValidateArgs>('validation.validateAction');
    const atom = declareAtom<InnerState>(['validation'], {}, (on) => [
      on(validateAction, (state, payload) => ({
        ...state,
        [payload.name]: payload.errors,
      })),
    ]);

    return {
      rx: StateUtil.toRxStore(localStore, atom),
      validate: (a: ValidateArgs) => localStore.dispatch(validateAction(a)),
    };
  },
};

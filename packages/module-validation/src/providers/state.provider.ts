import { injectable } from '@fridgefm/inverter';
import { declareAction, declareAtom, createStore } from '@reatom/core';
import { CoreTokens } from '@formula/module-core';
import { VALIDATION_STATE_TOKEN } from '../tokens';
import type { ValidateArgs, InnerState } from '../types';

export const validationStateProvider = injectable({
  provide: VALIDATION_STATE_TOKEN,
  useFactory: (storeUtils) => {
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
      // @TODO move to another state implementation
      rx: storeUtils.toRxStore(localStore, atom),
      validate: (a: ValidateArgs) => localStore.dispatch(validateAction(a)),
    };
  },
  inject: [CoreTokens.STORE_UTILS_TOKEN] as const,
});

import { ExtractToken, Provider } from '@formula/ioc';
import { declareAction, declareAtom } from '@reatom/core';
import { CoreTokens, StateUtil } from '@formula/core';
import noop from '@tinkoff/utils/function/noop';
import { VALIDATION_STATE_TOKEN } from '../tokens';
import type { ValidationState, ValidateArgs, InnerState } from '../types';

export const stateProvider: Provider<ValidationState> = {
  provide: VALIDATION_STATE_TOKEN,
  useFactory: ([globalStore]: [ExtractToken<typeof CoreTokens.GLOBAL_STORE_TOKEN>]) => {
    const validateAction = declareAction<ValidateArgs>('validation.validateAction');
    const atom = declareAtom<InnerState>(['validation'], {}, (on) => [
      on(validateAction, (state, payload) => ({
        ...state,
        [payload.name]: payload.errors,
      })),
    ]);

    globalStore.subscribe(atom, noop);

    return {
      rx: StateUtil.toRxStore(globalStore, atom),
      validate: (a: ValidateArgs) => globalStore.dispatch(validateAction(a)),
    };
  },
  deps: [CoreTokens.GLOBAL_STORE_TOKEN],
};

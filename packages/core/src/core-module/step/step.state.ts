import { declareAction, declareAtom } from '@reatom/core';
import noop from '@tinkoff/utils/function/noop';
import propSet from '@tinkoff/utils/object/propSet';
import { toRxStore } from '../../utils/state.util';

import type { GlobalStore } from '../global-store/global-store.types';
import type { SetBlockArgs, StepState } from './step.types';

const stepIncrement = declareAction('step.stepIncrement');
const stepBlock = declareAction<SetBlockArgs>('step.stepBlock');

export const useState = (globalStore: GlobalStore) => {
  const atom = declareAtom<StepState>(
    ['step'],
    {
      currentStep: 0,
      blocked: {},
    },
    (on) => [
      on(stepIncrement, (state) => ({
        ...state,
        currentStep: state.currentStep + 1,
      })),
      on(stepBlock, (state, { stepNum, value }) => ({
        ...state,
        blocked: propSet(stepNum, value, state.blocked),
      })),
    ],
  );

  globalStore.subscribe(atom, noop);

  return {
    _atom: atom,
    rx: toRxStore(globalStore, atom),
    actions: {
      stepIncrement: () => globalStore.dispatch(stepIncrement()),
      stepBlock: (a: SetBlockArgs) => globalStore.dispatch(stepBlock(a)),
    },
  };
};

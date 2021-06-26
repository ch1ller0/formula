import { declareAction, declareAtom } from '@reatom/core';
import noop from '@tinkoff/utils/function/noop';
import propSet from '@tinkoff/utils/object/propSet';
import { toRxStore } from '../../base/store';

import type { TProviderConsturctorArgs } from '../../types/provider.types';

export type State = {
  currentStep: number;
  blocked: Record<number, boolean>;
};

export type SetBlockArgs = { stepNum: number; value: boolean };

const stepIncrement = declareAction('step.stepIncrement');
const stepBlock = declareAction<SetBlockArgs>('step.stepBlock');

export const useState = ({ globalStore }: TProviderConsturctorArgs) => {
  const atom = declareAtom<State>(
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

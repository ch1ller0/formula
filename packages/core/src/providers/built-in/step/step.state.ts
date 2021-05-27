import { declareAction, declareAtom } from '@reatom/core';
import noop from '@tinkoff/utils/function/noop';
import { toRxStore } from '../../../base/store';

import type { TProviderConsturctorArgs } from '../../../types/provider.types';

const stepIncrement = declareAction('step.stepIncrement');

export const useState = ({ globalStore }: TProviderConsturctorArgs) => {
  const atom = declareAtom<number>(['step'], 0, (on) => [
    on(stepIncrement, (state) => state + 1),
  ]);

  globalStore.subscribe(atom, noop);

  return {
    _atom: atom,
    rx: toRxStore(globalStore, atom),
    actions: {
      stepIncrement: () => globalStore.dispatch(stepIncrement()),
    },
  };
};

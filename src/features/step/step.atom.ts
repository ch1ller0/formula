import { declareAction, declareAtom } from '@reatom/core';

export const useState = (deps: Deps) => {
  const stepIncrement = declareAction('step-increment');

  return {
    atom: declareAtom<number>('step.atom', initialState, (on) => [
      on(stepIncrement, (state) => state + 1),
    ]),
    actions: { stepIncrement },
  };
};

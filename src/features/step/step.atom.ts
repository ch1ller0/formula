import { declareAction, declareAtom } from '@reatom/core';

export const stepIncrement = declareAction('step-increment');
export const stepSet = declareAction<number>('step-increment');

export const stepAtom = declareAtom<number>('step.atom', 0, (on) => [
  on(stepIncrement, (state) => state + 1),
  on(stepSet, (_, payload) => payload),
]);

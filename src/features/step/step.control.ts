import { stepIncrement } from './step.atom';
import { ControlGenerator } from '../../generate';

export const nextStepControl = ControlGenerator.control({
  name: 'next-step',
  fn: (store) => () => {
    store.dispatch(stepIncrement());
  },
});

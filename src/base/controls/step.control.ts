import { stepIncrement } from '../atoms/step.atom';
import { ControlGenerator } from '../../generate';

export const nextStepControl = ControlGenerator.control({
  name: 'next-step',
  fn: (store) => () => {
    store.dispatch(stepIncrement());
  },
});

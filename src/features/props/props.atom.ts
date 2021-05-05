import { declareAction, declareAtom } from '@reatom/core';

export type Props = Record<string, unknown>;
type State = Record<string, Props>;

export const propsChange = declareAction<{
  name: string;
  value: Props;
}>('props-changed');

export const propsAtom = declareAtom<State>('props.atom', {}, (on) => [
  on(propsChange, (state, payload) => {
    const prevProps = state[payload.name];

    return {
      ...state,
      [payload.name]: {
        ...prevProps,
        ...payload.value,
      },
    };
  }),
]);

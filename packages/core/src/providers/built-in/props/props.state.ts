import { declareAction, declareAtom } from '@reatom/core';
import noop from '@tinkoff/utils/function/noop';
import mapObj from '@tinkoff/utils/object/map';
import { toRxStore } from '../../../base/store';

import type { TProviderConsturctorArgs } from '../../../types/provider.types';
import type { Flattened } from '../structure/structure.types';

export type Props = Record<string, unknown>;
type State = Record<string, Props>;

type ChangeFieldPropsArgs = {
  name: string;
  value: Props;
};

const changeFieldProps = declareAction<ChangeFieldPropsArgs>(
  'props.changeFieldProps',
);

export const useState = ({
  globalStore,
  structure,
}: TProviderConsturctorArgs & {
  structure: Flattened;
}) => {
  const initialState = mapObj(({ props }) => props, structure);
  const atom = declareAtom<State>(['props'], initialState, (on) => [
    on(changeFieldProps, (state, payload) => {
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

  globalStore.subscribe(atom, noop);

  return {
    _atom: atom,
    rx: toRxStore(globalStore, atom),
    actions: {
      changeFieldProps: (a: ChangeFieldPropsArgs) =>
        globalStore.dispatch(changeFieldProps(a)),
    },
  };
};

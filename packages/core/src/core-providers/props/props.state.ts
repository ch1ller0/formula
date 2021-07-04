import { declareAction, declareAtom } from '@reatom/core';
import noop from '@tinkoff/utils/function/noop';
import mapObj from '@tinkoff/utils/object/map';
import { toRxStore } from '../../base/store';

import type { TProviderConsturctorArgs } from '../../types/provider.types';
import type { EndStructure } from '../structure/structure.types';
import type { ChangeFieldPropsArgs, PropsState } from './props.types';

const changeFieldProps = declareAction<ChangeFieldPropsArgs>(
  'props.changeFieldProps',
);

export const useState = ({
  globalStore,
  structure,
}: TProviderConsturctorArgs & {
  structure: EndStructure;
}) => {
  const initialState = mapObj(({ props }) => props, structure);
  const atom = declareAtom<PropsState>(['props'], initialState, (on) => [
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

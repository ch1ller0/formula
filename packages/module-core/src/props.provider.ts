import { injectable } from '@fridgefm/inverter';
import { declareAction, declareAtom } from '@reatom/core';
import noop from '@tinkoff/utils/function/noop';
import mapObj from '@tinkoff/utils/object/map';
import { GLOBAL_STORE_TOKEN, PROPS_STORE_TOKEN, PROPS_SERVICE_TOKEN, STRUCTURE_STORE_TOKEN } from './tokens';
import { toRxStore } from './state.util';
import type { Props, PropsState } from './props.types';

export const propsProviders = [
  injectable({
    provide: PROPS_STORE_TOKEN,
    useFactory: (globalStore, structureStore) => {
      const initialState = mapObj(({ props }) => props, structureStore.initialState.fields);
      const setFieldPropsAction = declareAction<[string, Props]>('props.setFieldProps');

      const atom = declareAtom<PropsState>(['props'], initialState, (on) => [
        on(setFieldPropsAction, (state, payload) => {
          const prevProps = state[payload[0]];

          return {
            ...state,
            [payload[0]]: {
              ...prevProps,
              ...payload[1],
            },
          };
        }),
      ]);

      globalStore.subscribe(atom, noop);

      return {
        atom,
        rx: toRxStore(globalStore, atom),
        actions: {
          setFieldProps: (fieldName: string, props: Props) =>
            globalStore.dispatch(setFieldPropsAction([fieldName, props])),
        },
      };
    },
    inject: [GLOBAL_STORE_TOKEN, STRUCTURE_STORE_TOKEN] as const,
  }),
  injectable({
    provide: PROPS_SERVICE_TOKEN,
    useFactory: (propsStore) => propsStore.actions,
    inject: [PROPS_STORE_TOKEN] as const,
  }),
];

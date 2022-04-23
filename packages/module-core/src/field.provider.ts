import { Subject } from 'rxjs';
import { injectable } from '@fridgefm/inverter';
import { declareAction, declareAtom } from '@reatom/core';
import noop from '@tinkoff/utils/function/noop';
import mapObj from '@tinkoff/utils/object/map';
import filterObj from '@tinkoff/utils/object/filter';
import { FIELD_SERVICE_TOKEN, STRUCTURE_SERVICE_TOKEN, GLOBAL_STORE_TOKEN } from './tokens';
import { toRxStore } from './state.util';

import type { ChangeKeyValArgs, FieldState } from './field.types';
import type { TokenProvide } from '@fridgefm/inverter';

const changeKeyVal = declareAction<ChangeKeyValArgs>('field.changeKeyVal');

const fieldFactory = (
  structureService: TokenProvide<typeof STRUCTURE_SERVICE_TOKEN>,
  globalStore: TokenProvide<typeof GLOBAL_STORE_TOKEN>,
) => {
  const structure = structureService._getInitialState();
  const initialState = mapObj(({ field: { initialValue }, props }) => initialValue(props), structure.fields);
  const atom = declareAtom<FieldState>(
    ['field'],
    filterObj((value) => value !== null, initialState) as FieldState,
    (on) => [on(changeKeyVal, (state, payload) => ({ ...state, [payload.name]: payload.value }))],
  );
  const rxStore = toRxStore(globalStore, atom);
  const diffStream = new Subject<ChangeKeyValArgs>();

  globalStore.subscribe(atom, noop);

  return {
    getRxStore: () => rxStore,
    getDiffRx: () => diffStream.asObservable(),
    _getRenderDeps: () => ({
      atom,
      setValue: (args: ChangeKeyValArgs) => {
        diffStream.next(args); // Also send observable for click
        if (args.value !== null) {
          globalStore.dispatch(changeKeyVal(args));
        }
      },
    }),
  };
};

export const fieldProviders = [
  injectable({
    provide: FIELD_SERVICE_TOKEN,
    useFactory: fieldFactory,
    inject: [STRUCTURE_SERVICE_TOKEN, GLOBAL_STORE_TOKEN] as const,
  }),
];

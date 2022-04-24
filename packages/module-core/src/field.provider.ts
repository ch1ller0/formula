import { Subject } from 'rxjs';
import { injectable } from '@fridgefm/inverter';
import { declareAction, declareAtom } from '@reatom/core';
import noop from '@tinkoff/utils/function/noop';
import mapObj from '@tinkoff/utils/object/map';
import filterObj from '@tinkoff/utils/object/filter';
import { FIELD_SERVICE_TOKEN, FIELD_STORE_TOKEN, GLOBAL_STORE_TOKEN, STRUCTURE_STORE_TOKEN } from './tokens';
import { toRxStore } from './state.util';
import type { FieldState, SetFieldValueArgs } from './field.types';

export const fieldProviders = [
  injectable({
    provide: FIELD_STORE_TOKEN,
    useFactory: (globalStore, structureStore) => {
      const structure = structureStore.initialState;
      const initialState = mapObj(({ field: { initialValue }, props }) => initialValue(props), structure.fields);
      const setFieldValueAction = declareAction<SetFieldValueArgs>('field.setFieldValue');
      const atom = declareAtom<FieldState>(
        ['field'],
        filterObj((value) => value !== null, initialState) as FieldState,
        (on) => [on(setFieldValueAction, (state, payload) => ({ ...state, [payload.fieldName]: payload.value }))],
      );
      const diffSubject = new Subject<SetFieldValueArgs>();

      globalStore.subscribe(atom, noop);

      return {
        atom,
        actions: {
          setFieldValue: (fieldName, value) => {
            diffSubject.next({ fieldName, value }); // Also send observable for click
            if (value !== null) {
              globalStore.dispatch(setFieldValueAction({ fieldName, value }));
            }
          },
        },
        diffRx: diffSubject.asObservable(),
      };
    },
    inject: [GLOBAL_STORE_TOKEN, STRUCTURE_STORE_TOKEN] as const,
  }),
  injectable({
    provide: FIELD_SERVICE_TOKEN,
    useFactory: (fieldStore, globalStore) => {
      const rxStore = toRxStore(globalStore, fieldStore.atom);

      return {
        setFieldValue: (fieldName, value) => {
          fieldStore.actions.setFieldValue(fieldName, value);
        },
        getDiffRx: () => fieldStore.diffRx,
        getRxStore: () => rxStore,
      };
    },
    inject: [FIELD_STORE_TOKEN, GLOBAL_STORE_TOKEN] as const,
  }),
];

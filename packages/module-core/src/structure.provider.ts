import { injectable } from '@fridgefm/inverter';
import { declareAction, declareAtom } from '@reatom/core';
import noop from '@tinkoff/utils/function/noop';
import toPairs from '@tinkoff/utils/object/toPairs';
import {
  STRUCTURE_CONFIG_TOKEN,
  STRUCTURE_SERVICE_TOKEN,
  GLOBAL_STORE_TOKEN,
  STRUCTURE_STORE_TOKEN,
  STRUCTURE_BINDERS_TOKEN,
  FIELD_SERVICE_TOKEN,
} from './tokens';
import { selectors } from './structure.selector';
import { toRxStore } from './state.util';
import { getInitialStructure, normalizate } from './structure.util';
import type { GroupStructKey, StructureState, GroupStructVal, ArrayStructKey, FieldStructVal } from './structure.types';

type ToggleGroupVisibilityArgs = {
  groupKeys: GroupStructKey[];
};

type RemoveRowArgs = {
  rowNum: number;
  arrName: ArrayStructKey;
};

type AppendRowArgs = {
  arrName: ArrayStructKey;
};

export const structureProviders = [
  injectable({
    provide: STRUCTURE_STORE_TOKEN,
    useFactory: (structureConfig, globalStore) => {
      const initialConfig = getInitialStructure(structureConfig);
      const normalizedState = normalizate(initialConfig);
      const toggleGroupVisibilityAction = declareAction<ToggleGroupVisibilityArgs>('structure.toggle-group-visiblity');
      const removeRowAction = declareAction<RemoveRowArgs>('structure.remove-row');
      const appendRowAction = declareAction<AppendRowArgs>('structure.append-row');

      const atom = declareAtom<StructureState>(['structure'], normalizedState, (on) => [
        on(toggleGroupVisibilityAction, (state, { groupKeys }) => {
          const part = groupKeys.reduce((acc, groupKey) => {
            const prevGroupState = state.groups[groupKey] as GroupStructVal;
            const opts = {
              ...prevGroupState.opts,
              invisible: !prevGroupState.opts.invisible,
            };

            return { ...acc, [groupKey]: { ...prevGroupState, opts } };
          }, {});

          return { ...state, groups: { ...state.groups, ...part } };
        }),
        on(appendRowAction, (state, { arrName }) => {
          const previosArrayState = state.arrays[arrName];
          const { children, opts, generator } = previosArrayState;
          const generated = new Array(opts?.count + 1).fill(0).map(generator);
          toPairs(generated).forEach(([entName, entVal], index) => {
            const childId = `fld.${entName}[${index}]`;
          });
          console.log(generated);

          return {
            ...state,
            fields: {
              ...state.fields,
              'fld.remove_button[3]': state.fields['fld.remove_button[1]'],
              'fld.address[3]': state.fields['fld.address[1]'],
            }, // @TODO debug
            arrays: {
              ...state.arrays,
              [arrName]: {
                ...previosArrayState,
                opts: { ...opts, count: opts.count + 1 },
                children: [...children, 'fld.address[3]', 'fld.remove_button[3]'],
              },
            },
          };
        }),
        on(removeRowAction, (state, { rowNum, arrName }) => {
          const previosArrayState = state.arrays[arrName];
          return {
            ...state,
            arrays: {
              ...state.arrays,
              [arrName]: {
                ...previosArrayState,
                opts: { ...previosArrayState.opts, count: previosArrayState.opts.count - 1 },
                children: previosArrayState.children.filter(
                  (fieldName) => fieldName[fieldName.length - 2] !== rowNum.toString(),
                ),
              },
            },
          };
        }),
      ]);

      globalStore.subscribe(atom, noop);

      return {
        atom,
        actions: {
          toggleGroupsVisibility: (groupKeys) => {
            globalStore.dispatch(toggleGroupVisibilityAction({ groupKeys }));
          },
          removeRow: (arrName: ArrayStructKey, rowNum: number) => {
            globalStore.dispatch(removeRowAction({ arrName, rowNum }));
          },
          appendRow: (arrName: ArrayStructKey) => {
            globalStore.dispatch(appendRowAction({ arrName }));
          },
        },
        initialState: normalizedState,
        getState: () => globalStore.getState(atom),
      };
    },
    inject: [STRUCTURE_CONFIG_TOKEN, GLOBAL_STORE_TOKEN] as const,
  }),
  injectable({
    provide: STRUCTURE_SERVICE_TOKEN,
    useFactory: (structureStore, globalStore) => {
      const rxStore = toRxStore(globalStore, structureStore.atom);

      return { ...structureStore.actions, selectors, getRxStore: () => rxStore };
    },
    inject: [STRUCTURE_STORE_TOKEN, GLOBAL_STORE_TOKEN] as const,
  }),
  injectable({
    provide: STRUCTURE_BINDERS_TOKEN,
    useFactory: (structureStore, fieldService, globalStore) => ({
      removeRow: () => (fieldName) => {
        fieldService
          .getDiffRx()
          .pipe(fieldService.selectors.getClicks({ fieldName }))
          .subscribe(() => {
            // @TODO add type guards
            const { fields } = globalStore.getState(structureStore.atom);
            // @ts-ignore
            const field = fields[fieldName] as FieldStructVal;
            const arrName = field.path[field.path.length - 1];
            const rowNum = fieldName[fieldName.length - 2];
            structureStore.actions.removeRow(arrName, rowNum);
          });
      },
      appendRow: ({ arrName }) => (fieldName) => {
        fieldService
          .getDiffRx()
          .pipe(fieldService.selectors.getClicks({ fieldName }))
          .subscribe(() => {
            structureStore.actions.appendRow(arrName);
          });
      },
    }),
    inject: [STRUCTURE_STORE_TOKEN, FIELD_SERVICE_TOKEN, GLOBAL_STORE_TOKEN] as const,
  }),
];

import toPairs from '@tinkoff/utils/object/toPairs';
import range from '@tinkoff/utils/array/range';
import type {
  TFieldStructure,
  FormStructure,
  GroupOut,
  StructureFactory,
  StructureInput,
  ArrayOut,
} from '@formula/core-types';
import type {
  StructureState,
  GroupStructKey,
  ScreenStructKey,
  FieldStructKey,
  ArrayStructKey,
} from './structure.types';

export const getInitialStructure = (factory: StructureFactory) => {
  return factory({
    group: (a, opts) => ({
      type: 'group',
      group: a,
      opts: opts || {},
    }),
    array: (generator, opts) => ({
      type: 'array',
      array: range(opts?.count || 2).map(generator),
      opts: opts || { count: 2 },
    }),
  });
};

export const normalizate = (state: FormStructure) => {
  const temp = {
    groups: {},
    arrays: {},
    fields: {},
  } as StructureState;

  const traversal = {
    field: (a: TFieldStructure, fieldKey: FieldStructKey) => {
      if (fieldKey in temp.fields) {
        throw new Error(`duplicate key found in fields: ${fieldKey}`);
      }
      temp.fields[fieldKey] = { ...a, id: fieldKey };
      return fieldKey;
    },
    group: ({ group, opts }: GroupOut, groupKey: GroupStructKey | ScreenStructKey) => {
      if (groupKey in temp.groups) {
        throw new Error(`duplicate key found in groups: ${groupKey}`);
      }
      const children: (GroupStructKey | ScreenStructKey)[] = [];

      toPairs(group).forEach(([entName, entVal]) => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        const childId = traversal.something(entVal, entName) as GroupStructKey | ScreenStructKey;
        children.push(childId);
      });

      // @ts-ignore
      temp.groups[groupKey] = { id: groupKey, children, opts };

      return groupKey;
    },
    array: ({ array, opts }: ArrayOut, arrayKey: ArrayStructKey) => {
      if (arrayKey in temp.arrays) {
        throw new Error(`duplicate key found in arrays: ${arrayKey}`);
      }
      const children = [] as FieldStructKey[];
      array.forEach((rec, index) => {
        toPairs(rec).forEach(([entName, entVal]) => {
          const childId = traversal.something(entVal, `${entName}[${index}]`) as FieldStructKey;
          children.push(childId);
        });
      });

      temp.arrays[arrayKey] = { id: arrayKey, children, opts };

      return arrayKey;
    },
    something: (a: StructureInput, key: string) => {
      if ('group' in a) {
        return traversal.group(a, `grp.${key}`);
      }

      if ('array' in a) {
        return traversal.array(a, `arr.${key}`);
      }

      return traversal.field(a, `fld.${key}`);
    },
  };

  toPairs(state).forEach(([initKey, screenV]) => {
    traversal.group(screenV, `scr.${initKey}`);
  });

  return temp;
};

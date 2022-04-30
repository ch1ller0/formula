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
  ParentPath,
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
      generator,
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
    field: (a: TFieldStructure, fieldKey: FieldStructKey, path: ParentPath) => {
      if (fieldKey in temp.fields) {
        throw new Error(`duplicate key found in fields: ${fieldKey}`);
      }
      temp.fields[fieldKey] = { ...a, id: fieldKey, path };
      return fieldKey;
    },
    group: ({ group, opts }: GroupOut, groupKey: GroupStructKey | ScreenStructKey, path: ParentPath) => {
      if (groupKey in temp.groups) {
        throw new Error(`duplicate key found in groups: ${groupKey}`);
      }
      const children: (GroupStructKey | ScreenStructKey)[] = [];

      toPairs(group).forEach(([entName, entVal]) => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        const childId = traversal.something(entVal, entName, path) as GroupStructKey | ScreenStructKey;
        children.push(childId);
      });

      // @ts-ignore
      temp.groups[groupKey] = { id: groupKey, children, opts };

      return groupKey;
    },
    array: ({ array, opts, generator }: ArrayOut, arrayKey: ArrayStructKey, path: ParentPath) => {
      if (arrayKey in temp.arrays) {
        throw new Error(`duplicate key found in arrays: ${arrayKey}`);
      }
      const children = [] as FieldStructKey[];
      array.forEach((rec, index) => {
        toPairs(rec).forEach(([entName, entVal]) => {
          const childId = traversal.something(entVal, `${entName}[${index}]`, path) as FieldStructKey;
          children.push(childId);
        });
      });

      temp.arrays[arrayKey] = { id: arrayKey, children, opts, generator };

      return arrayKey;
    },
    something: (a: StructureInput, key: string, path: ParentPath) => {
      if ('group' in a) {
        const grpKey = `grp.${key}` as const;
        return traversal.group(a, grpKey, [...path, grpKey]);
      }

      if ('array' in a) {
        const arrKey = `arr.${key}` as const;
        return traversal.array(a, arrKey, [...path, arrKey]);
      }
      const fldKey = `fld.${key}` as const;
      return traversal.field(a, fldKey, path);
    },
  };

  toPairs(state).forEach(([initKey, screenVal]) => {
    const scrKey = `scr.${initKey}` as const;
    traversal.group(screenVal, scrKey, [scrKey]);
  });

  return temp;
};

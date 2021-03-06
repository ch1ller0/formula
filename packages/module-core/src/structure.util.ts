import toPairs from '@tinkoff/utils/object/toPairs';
import type { TFieldStructure, FormStructure, GroupOut, StructureFactory, StructureInput } from '@formula/core-types';
import type { StructureState, GroupStructKey, ScreenStructKey, FieldStructKey } from './structure.types';

export const getInitialStructure = (factory: StructureFactory) => {
  return factory({
    group: (a, opts) => ({
      type: 'group',
      group: a,
      opts: opts || {},
    }),
  });
};

export const normalizate = (state: FormStructure) => {
  const temp = {
    groups: {},
    fields: {},
  } as StructureState;

  const traverseGroup = ({ group, opts }: GroupOut, groupKey: GroupStructKey | ScreenStructKey) => {
    if (groupKey in temp.groups) {
      throw new Error(`duplicate key found in groups: ${groupKey}`);
    }
    const children: (GroupStructKey | ScreenStructKey)[] = [];

    toPairs(group).forEach(([entName, entVal]) => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const childId = traverseUnknown(entVal, entName) as GroupStructKey | ScreenStructKey;
      children.push(childId);
    });

    // @ts-ignore
    temp.groups[groupKey] = { id: groupKey, children, opts };

    return groupKey;
  };

  const traverseField = (a: TFieldStructure, fieldKey: FieldStructKey) => {
    if (fieldKey in temp.fields) {
      throw new Error(`duplicate key found in fields: ${fieldKey}`);
    }
    temp.fields[fieldKey] = { ...a, id: fieldKey };
    return fieldKey;
  };

  const traverseUnknown = (a: StructureInput, key: string) => {
    if ('group' in a) {
      return traverseGroup(a, `grp.${key}`);
    }

    return traverseField(a, `fld.${key}`);
  };

  toPairs(state).forEach(([initKey, screenV]) => {
    traverseGroup(screenV, `scr.${initKey}`);
  });

  return temp;
};

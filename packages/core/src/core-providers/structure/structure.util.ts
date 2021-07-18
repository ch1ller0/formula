import toPairs from '@tinkoff/utils/object/toPairs';
import { TFieldStructure } from '../../types/base.types';
import type {
  FormStructure,
  GroupOut,
  StructureFactory,
  StructureInput,
  NormalizedStructure,
  GroupStructKey,
  ScreenStructKey,
} from './structure.types';

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
  } as NormalizedStructure;

  const traverseGroup = (
    { group, opts }: GroupOut,
    groupKey: GroupStructKey | ScreenStructKey,
  ) => {
    if (groupKey in temp.groups) {
      throw new Error(`duplicate key found in groups: ${groupKey}`);
    }
    const children = [] as string[];

    toPairs(group).map(([entName, entVal]) => {
      const childId = traverseUnknown(entVal, entName);
      children.push(childId);
    });

    temp.groups[groupKey] = { id: groupKey, children, opts };

    return groupKey;
  };

  const traverseField = (a: TFieldStructure, fieldKey: string) => {
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
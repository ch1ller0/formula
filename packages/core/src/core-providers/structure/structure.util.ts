import toPairs from '@tinkoff/utils/object/toPairs';
import { TFieldStructure } from '../../types/base.types';
import type {
  FormStructure,
  GroupOut,
  StructureFactory,
  StructureInput,
} from './structure.types';

export const toFieldsObj = (
  obj: FormStructure,
): Record<string, TFieldStructure> => {
  const flattened = {};

  const extractFields = (str: FormStructure) =>
    toPairs(str).forEach(([key, value]) => {
      if ('group' in value) {
        return extractFields(value.group);
      }
      flattened[key] = value;
    });

  extractFields(obj);
  return flattened;
};

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
  };

  const traverseGroup = ({ group, opts }: GroupOut, groupKey: string) => {
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

  const traverseField = (a, fieldKey: string) => {
    temp.fields[fieldKey] = a;
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

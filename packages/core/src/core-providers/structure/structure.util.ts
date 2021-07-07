import toPairs from '@tinkoff/utils/object/toPairs';
import { TFieldStructure } from '../../types/base.types';
import type { FormStructure, StructureFactory } from './structure.types';

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

export const getInitialState = (factory: StructureFactory) => {
  return factory({
    group: (a, opts) => ({
      type: 'group',
      group: a,
      opts: opts || {},
    }),
  });
};

import toPairs from '@tinkoff/utils/object/toPairs';
import flatten from '@tinkoff/utils/array/flatten';
import { FieldStructKey, StructureState, ScreenStructKey, GroupStructVal } from './structure.types';

type Args = {
  invisSensitive: boolean;
};

export const allScreenFields = (
  str: StructureState,
  { invisSensitive }: Args = { invisSensitive: true },
): [ScreenStructKey, FieldStructKey[]] => {
  const flatChildren = (a: GroupStructVal) => {
    return {
      ...a,
      children: flatten(
        a.children?.map((key) => {
          // @ts-ignore
          const resolved = str.groups[key];
          if (!resolved) {
            return key;
          }
          if (invisSensitive && resolved.opts.invisible) {
            return [];
          }
          return resolved?.children;
        }),
      ),
    } as GroupStructVal;
  };

  // @ts-ignore
  return (
    toPairs(str.groups)
      .filter(([key]) => key.includes('scr'))
      .map(([key, val]) => [key, flatChildren(val)])
      // @ts-ignore
      .map(([key, val]) => [key, val.children])
  );
};

export const selectors = {
  allScreenFields,
};

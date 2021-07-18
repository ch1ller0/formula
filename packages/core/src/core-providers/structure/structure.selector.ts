import toPairs from '@tinkoff/utils/object/toPairs';
import flatten from '@tinkoff/utils/array/flatten';
import {
  FieldStructKey,
  StructureState,
  ScreenStructKey,
} from './structure.types';

type Args = {
  invisSensitive: boolean;
};

export const allScreenFields = (
  str: StructureState,
  { invisSensitive }: Args = { invisSensitive: true },
): [ScreenStructKey, FieldStructKey[]] => {
  const flatChildren = (a) => {
    return {
      ...a,
      children: flatten(
        a.children?.map((key) => {
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
    };
  };

  // @ts-ignore
  return toPairs(str.groups)
    .filter(([key]) => key.includes('scr'))
    .map(([key, val]) => [key, flatChildren(val)])
    .map(([key, val]) => [key, val.children]);
};

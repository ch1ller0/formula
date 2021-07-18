import type { TFieldStructure } from '../../types/base.types';
import type { TProviderService } from '../../types/provider.types';
import type { Atom } from '@reatom/core';
type ScreenName = string;

export type EndStructure = Record<string, TFieldStructure>;
export type StructureInput = GroupOut | TFieldStructure;
export type FormStructure = Record<ScreenName, GroupOut>;

export type GroupOpts = {
  horizontal?: true;
  invisible?: boolean;
};
export type GroupOut = {
  type: 'group';
  group: Record<string, StructureInput>;
  opts: GroupOpts;
};
type Args = {
  group(cfg: Record<string, StructureInput>, opts?: GroupOpts): GroupOut;
};
export type StructureFactory = (args: Args) => FormStructure;

export type FieldStructKey = `fld.${string}`;
export type ScreenStructKey = `scr.${string}`;
export type GroupStructKey = `grp.${string}`;

export type FieldStructVal = { id: FieldStructKey } & TFieldStructure;
export type GroupStructVal = {
  id: ScreenStructKey | GroupStructKey;
  children: (FieldStructKey | GroupStructKey)[];
  opts: GroupOpts;
};

export type NormalizedStructure = {
  fields: Record<FieldStructKey, FieldStructVal>;
  groups: Record<ScreenStructKey | GroupStructKey, GroupStructVal>;
};

export interface TStructureService extends TProviderService {
  _getInitialState: () => NormalizedStructure;
  _getRenderDeps(): {
    atom: Atom<NormalizedStructure>;
  };
}

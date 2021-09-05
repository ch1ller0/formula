import type { Atom } from '@reatom/core';
import type { Observable } from 'rxjs';
import type { TFieldStructure } from '../../types/base.types';
import type { TProviderService } from '../../types/provider.types';

type ScreenName = string;

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

/**
 * Basically a normalized structure
 */
export type StructureState = {
  fields: Record<FieldStructKey, FieldStructVal>;
  groups: Record<ScreenStructKey | GroupStructKey, GroupStructVal>;
};

export interface TStructureService extends TProviderService {
  _getInitialState: () => StructureState;
  getRxStore: () => Observable<StructureState>;
  _getRenderDeps(): {
    atom: Atom<StructureState>;
  };
}

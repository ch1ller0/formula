import type { Atom } from '@reatom/core';
import type { Observable } from 'rxjs';
import type { TFieldStructure, GroupOpts, ArrayOpts } from '@formula/core-types';
import type { selectors } from './structure.selector';

export type FieldStructKey = `fld.${string}`;
export type ScreenStructKey = `scr.${string}`;
export type GroupStructKey = `grp.${string}`;
export type ArrayStructKey = `arr.${string}`;

export type FieldStructVal = { id: FieldStructKey } & TFieldStructure;
export type GroupStructVal = {
  id: ScreenStructKey | GroupStructKey;
  children: (FieldStructKey | GroupStructKey)[];
  opts: GroupOpts;
};
export type ArrayStructVal = {
  id: ArrayStructKey;
  children: FieldStructKey[];
  opts: ArrayOpts;
};
/**
 * Basically a normalized structure
 */
export type StructureState = {
  fields: Record<FieldStructKey, FieldStructVal>;
  groups: Record<ScreenStructKey | GroupStructKey, GroupStructVal>;
  arrays: Record<ArrayStructKey, ArrayStructVal>;
};

type StructureActions = {
  toggleGroupsVisibility: (a: GroupStructKey[]) => void;
};

export type StructureStore = {
  atom: Atom<StructureState>;
  actions: StructureActions;
  initialState: StructureState;
};

export type StructureService = {
  getRxStore: () => Observable<StructureState>;
  selectors: typeof selectors;
} & StructureActions;

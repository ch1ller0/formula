import type { TFieldStructure } from '../../types/base.types';
import type { TProviderService } from '../../types/provider.types';
import type { Atom } from '@reatom/core';
type ScreenName = string;

export type EndStructure = Record<string, TFieldStructure>;
export type StructureInput = Group | TFieldStructure;
export type Group = { group: Record<string, StructureInput> };
export type FormStructure = Record<ScreenName, StructureInput>;
type Args = {
  group(cfg: Record<string, StructureInput>): Group;
};
export type StructureFactory = (args: Args) => FormStructure;

export interface TStructureService extends TProviderService {
  _getInitialConfig: () => FormStructure;
  _getInitialState: () => EndStructure;
  _getRenderDeps(): {
    atom: Atom<EndStructure>;
  };
}

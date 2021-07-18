import type { TFieldStructure } from '../../types/base.types';
import type { TProviderService } from '../../types/provider.types';
import type { Atom } from '@reatom/core';
type ScreenName = string;

export type EndStructure = Record<string, TFieldStructure>;
export type StructureInput = GroupOut | TFieldStructure;
export type FormStructure = Record<ScreenName, GroupOut>;

export type GroupOpts = {
  horizontal?: true;
  visible?: boolean;
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

export interface TStructureService extends TProviderService {
  _getInitialConfig: () => FormStructure;
  _getInitialState: () => EndStructure;
  _getRenderDeps(): {
    atom: Atom<EndStructure>;
  };
}

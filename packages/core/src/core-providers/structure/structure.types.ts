import type { TFieldStructure } from '../../types/base.types';
import type { TProviderService } from '../../types/provider.types';
type ScreenName = string;

export type EndStructure = Record<string, TFieldStructure>;
export type StructureInput = Group | Array | TFieldStructure;
export type Array = { array: StructureInput[] };
export type Group = { group: Record<string, StructureInput> };
export type FormStructure = Record<ScreenName, StructureInput>;
type Args = {
  group(cfg: Record<string, StructureInput>): Group;
  array(cfg: Record<string, StructureInput>): Array;
};
export type StructureFactory = (args: Args) => FormStructure;

export interface TStructureService extends TProviderService {
  _getInitialState: () => EndStructure;
}

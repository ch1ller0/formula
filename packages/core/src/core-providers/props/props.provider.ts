import { StructureProvider } from '../index';
import { useState, Props } from './props.state';

import type {
  TProviderConfig,
  TProviderService,
  TProviderConsturctorArgs,
} from '../../types/provider.types';
import type { TStructureService } from '../structure/structure.types';
class PropsService implements TProviderService {
  private readonly _selfState: ReturnType<typeof useState>;

  constructor({
    deps,
    globalStore,
  }: TProviderConsturctorArgs<[TStructureService]>) {
    const [structureService] = deps;
    const structure = structureService._getInitialState();

    this._selfState = useState({ globalStore, structure, deps });
  }

  setFieldProp(name: string, value: Props) {
    this._selfState.actions.changeFieldProps({ name, value });
  }

  getRxStore() {
    return this._selfState.rx;
  }

  _getRenderDeps() {
    return { atom: this._selfState._atom };
  }
}

export const PropsProvider: TProviderConfig<PropsService> = {
  name: 'props',
  useService: PropsService,
  deps: [StructureProvider],
};

import { StructureProvider, TStructureService } from '../index';
import { useState } from './props.state';
import { TPropsService, Props } from './props.types';

import type {
  TProviderConfig,
  TProviderConsturctorArgs,
} from '../../types/provider.types';
class PropsService implements TPropsService {
  private readonly _selfState: ReturnType<typeof useState>;

  constructor({
    deps,
    globalStore,
  }: TProviderConsturctorArgs<[TStructureService]>) {
    const [structureService] = deps;
    const structure = structureService._getInitialState();

    this._selfState = useState({ globalStore, structure, deps });
  }

  useBinders() {
    return {};
  }

  setFieldProp(name: string, value: Props) {
    this._selfState.actions.changeFieldProps({ name, value });
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

import { useState } from './props.state';
import {
  STRUCTURE_SERVICE_TOKEN,
  GLOBAL_STORE_TOKEN,
  PROPS_SERVICE_TOKEN,
} from '../tokens';

import type { Provider } from '@formula/ioc';
import type { TPropsService, Props } from './props.types';
import type { TStructureService } from '../structure/structure.types';
import type { GlobalStore } from '../global-store/global-store.types';

class PropsService implements TPropsService {
  private readonly _selfState: ReturnType<typeof useState>;

  constructor(deps: [TStructureService, GlobalStore]) {
    const [structureService, globalStore] = deps;
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

export const propsProvider: Provider = {
  provide: PROPS_SERVICE_TOKEN,
  useClass: PropsService,
  deps: [STRUCTURE_SERVICE_TOKEN, GLOBAL_STORE_TOKEN],
};

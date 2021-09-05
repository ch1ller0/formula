import { Subject } from 'rxjs';
import { FIELD_SERVICE_TOKEN, STRUCTURE_SERVICE_TOKEN, GLOBAL_STORE_TOKEN } from '../tokens';
import { useState } from './field.state';
import type { Provider } from '@formula/ioc';

import type { TStructureService } from '../structure/structure.types';
import type { GlobalStore } from '../global-store/global-store.types';
import type { TFieldService, ChangeKeyValArgs } from './field.types';

class FieldService implements TFieldService {
  private readonly _selfState: ReturnType<typeof useState>;

  private readonly _diffStream: Subject<ChangeKeyValArgs>;

  constructor(deps: [TStructureService, GlobalStore]) {
    const [structureService, globalStore] = deps;
    const structure = structureService._getInitialState();
    this._selfState = useState({ globalStore, structure });
    this._diffStream = new Subject();
  }

  getRxStore() {
    return this._selfState.rx;
  }

  /**
   * Return observable of changeKeyVal events
   */
  getDiffRx() {
    return this._diffStream.asObservable();
  }

  _getRenderDeps() {
    return {
      atom: this._selfState._atom,
      setValue: (args: ChangeKeyValArgs) => {
        this._diffStream.next(args); // Also send observable for click
        if (args.value !== null) {
          this._selfState.actions.changeKeyVal(args);
        }
      },
    };
  }
}

export const fieldProvider: Provider = {
  provide: FIELD_SERVICE_TOKEN,
  useClass: FieldService,
  deps: [STRUCTURE_SERVICE_TOKEN, GLOBAL_STORE_TOKEN],
};

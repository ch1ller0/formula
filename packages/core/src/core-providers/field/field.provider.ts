import { Subject } from 'rxjs';
import { useState } from './field.state';
import { TStructureService, StructureProvider } from '../index';

import type {
  TProviderConfig,
  TProviderConsturctorArgs,
} from '../../types/provider.types';
import type {
  TFieldService,
  FieldState,
  ChangeKeyValArgs,
} from './field.types';

class FieldService implements TFieldService {
  private readonly _selfState: ReturnType<typeof useState>;
  private readonly _diffStream: Subject<ChangeKeyValArgs>;

  constructor(args: TProviderConsturctorArgs<[TStructureService]>) {
    const [structureService] = args.deps;
    const structure = structureService._getInitialState();
    this._selfState = useState({ ...args, structure });
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

export const FieldProvider: TProviderConfig<FieldService> = {
  name: 'field',
  useService: FieldService,
  deps: [StructureProvider],
};

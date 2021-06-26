import { Subject } from 'rxjs';
import { FieldsFactory } from './field.gen';
import { PropsProvider } from '../';
import { useState, State } from './field.state';

import type {
  TProviderConfig,
  TProviderService,
  TProviderConsturctorArgs,
  TToProviderInstance,
} from '../../../types/provider.types';
import { StructureProvider } from '../structure/structure.provider';

class FieldService implements TProviderService {
  private readonly _selfState: ReturnType<typeof useState>;
  private readonly _diffStream: Subject<Partial<State>>;

  constructor(args: TProviderConsturctorArgs) {
    this._selfState = useState(args);
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
    return this._selfState;
  }
}

export const FieldProvider: TProviderConfig<FieldService> = {
  name: 'field',
  useService: FieldService,
  deps: [StructureProvider],
};

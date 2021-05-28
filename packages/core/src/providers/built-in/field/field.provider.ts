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

class FieldService implements TProviderService {
  private readonly _propsService: TToProviderInstance<typeof PropsProvider>;
  private readonly _selfState: ReturnType<typeof useState>;
  private readonly _diffStream: Subject<Partial<State>>;

  constructor(args: TProviderConsturctorArgs) {
    const [propsService] = args.deps;
    this._propsService = propsService;
    this._selfState = useState(args);
    this._diffStream = new Subject();
  }

  getRxStore() {
    return this._selfState.rx;
  }

  /**
   * Return stream of changeKeyVal events
   */
  getDiffRx() {
    return this._diffStream.asObservable();
  }

  renderWrapper() {
    return FieldsFactory({
      atom: this._selfState._atom,
      actions: this._selfState._actions,
      propsAtom: this._propsService.getAtom(),
      onChange: (a) => {
        this._diffStream.next(a);
      },
    });
  }
}

export const FieldProvider: TProviderConfig<FieldService> = {
  name: 'field',
  useService: FieldService,
  deps: [PropsProvider],
};

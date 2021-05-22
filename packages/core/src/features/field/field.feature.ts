import { Atom, declareAction, declareAtom } from '@reatom/core';
import { toRxStore } from '../../base/store';

import type {
  TProviderConfig,
  TProviderService,
  TProviderConsturctorArgs,
} from '../features.type';
import type { TPrimitive } from '../../types';
import type { Observable } from 'rxjs';

type State = Record<string, TPrimitive>;

const changeAction = declareAction<{
  name: string;
  value: TPrimitive;
}>('field.changeAction');

class FieldService implements TProviderService {
  private readonly _atom: Atom<State>;
  private readonly _rxStore: Observable<State>;

  constructor({ globalStore }: TProviderConsturctorArgs) {
    // @TODO populate atom instead of {}
    this._atom = declareAtom<State>('field.atom', {}, (on) => [
      on(changeAction, (state, payload) => ({
        ...state,
        [payload.name]: payload.value,
      })),
    ]);
    this._rxStore = toRxStore(globalStore, this._atom);
  }

  getRxStore() {
    return this._rxStore;
  }

  getAtom() {
    return this._atom;
  }

  getActions() {
    return { changeAction };
  }
}

export const FieldFeature: TProviderConfig<FieldService> = {
  name: 'field',
  useService: FieldService,
};

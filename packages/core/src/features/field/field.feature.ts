import { Atom, declareAction, declareAtom } from '@reatom/core';
import { toRxStore } from '../../base/store';

import type {
  TFeatureConfig,
  TFeatureService,
  TFeatureConstructorArgs,
} from '../features.type';
import type { TPrimitive } from '../../types';
import type { Observable } from 'rxjs';

type State = Record<string, TPrimitive>;

const changeAction = declareAction<{
  name: string;
  value: string | number;
}>('field-change.action');

class FieldService implements TFeatureService {
  private readonly _atom: Atom<State>;
  private readonly _rxStore: Observable<State>;

  constructor({}: TFeatureConstructorArgs) {
    // @TODO populate atom instead of {}
    this._atom = declareAtom<State>('field.atom', {}, (on) => [
      on(changeAction, (state, payload) => ({
        ...state,
        [payload.name]: payload.value,
      })),
    ]);
    this._rxStore = toRxStore(this._atom);
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

export const FieldFeature: TFeatureConfig = {
  name: 'field',
  useService: FieldService,
};

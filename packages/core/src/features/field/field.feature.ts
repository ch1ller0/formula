import { Atom, declareAction, declareAtom } from '@reatom/core';
import { toRxStore } from '../../base/store';
import { shareReplay } from 'rxjs/operators';

import type {
  TFeatureConfig,
  TFeatureService,
  TFeatureConstructorArgs,
} from '../features.type';
import type { TPrimitive } from '../../types';

type State = Record<string, TPrimitive>;

const changeAction = declareAction<{
  name: string;
  value: string | number;
}>('field-change.action');

class FieldService implements TFeatureService {
  private readonly _atom: Atom<State>;

  constructor({}: TFeatureConstructorArgs) {
    // @TODO populate atom instead of {}
    this._atom = declareAtom<State>('field.atom', {}, (on) => [
      on(changeAction, (state, payload) => ({
        ...state,
        [payload.name]: payload.value,
      })),
    ]);
  }

  getRxStore() {
    return toRxStore(this._atom).pipe(shareReplay());
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

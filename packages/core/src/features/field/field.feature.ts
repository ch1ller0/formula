import { Atom, declareAction, declareAtom } from '@reatom/core';
import { toRxStore } from '../../base/store';
import { shareReplay } from 'rxjs/operators';

import type {
  FeatureConfig,
  FeatureService,
  FeatureConstructorArgs,
} from '../features.type';
import type { Primitive } from '../../types';

type State = Record<string, Primitive>;

const changeAction = declareAction<{
  name: string;
  value: string | number;
}>('field-change.action');

class FieldService implements FeatureService {
  private readonly _atom: Atom<State>;

  constructor({}: FeatureConstructorArgs) {
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

export const FieldFeature: FeatureConfig = {
  name: 'field',
  useService: FieldService,
};

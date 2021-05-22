import { Atom, declareAction, declareAtom } from '@reatom/core';
import mapObj from '@tinkoff/utils/object/map';
import isFunction from '@tinkoff/utils/is/function';
import noop from '@tinkoff/utils/function/noop';
import { toRxStore } from '../../../base/store';

import type {
  TProviderConfig,
  TProviderService,
  TProviderConsturctorArgs,
} from '../../../types/provider.types';
import type { TPrimitive } from '../../../types/base.types';
import type { Observable } from 'rxjs';

type State = Record<string, TPrimitive | null>;

const changeAction = declareAction<{
  name: string;
  value: TPrimitive;
}>('field.changeAction');

class FieldService implements TProviderService {
  private readonly _atom: Atom<State>;
  private readonly _rxStore: Observable<State>;

  constructor({ globalStore, structure }: TProviderConsturctorArgs) {
    const initialState = mapObj(
      ({ field: { initialValue }, props }) =>
        isFunction(initialValue) ? initialValue(props) : initialValue,
      structure.reduce((acc, cur) => ({ ...acc, ...cur }), {}),
    );

    this._atom = declareAtom<State>('field.atom', initialState, (on) => [
      on(changeAction, (state, payload) => ({
        ...state,
        [payload.name]: payload.value,
      })),
    ]);
    this._rxStore = toRxStore(globalStore, this._atom);
    // @TODO so that all the methods apply on first render
    globalStore.subscribe(this._atom, noop);
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

export const FieldProvider: TProviderConfig<FieldService> = {
  name: 'field',
  useService: FieldService,
};

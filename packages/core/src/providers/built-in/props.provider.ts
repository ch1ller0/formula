import toPairs from '@tinkoff/utils/object/toPairs';
import noop from '@tinkoff/utils/function/noop';
import mapObj from '@tinkoff/utils/object/map';
import { declareAction, declareAtom } from '@reatom/core';
import { toRxStore } from '../../base/store';

import type {
  TProviderConfig,
  TProviderService,
  TProviderConsturctorArgs,
} from '../../types/provider.types';
import type { Atom } from '@reatom/core';
import type { Observable } from 'rxjs';

type Props = Record<string, unknown>;
type State = Record<string, Props>;

const changeFieldProps = declareAction<{
  name: string;
  value: Props;
}>('props.changeFieldProps');

class PropsService implements TProviderService {
  private readonly _atom: Atom<State>;
  private readonly _globalStore: TProviderConsturctorArgs['globalStore'];
  private readonly _rxStore: Observable<State>;

  constructor({ structure, globalStore }: TProviderConsturctorArgs) {
    this._globalStore = globalStore;
    const initialState = mapObj(
      ({ props }) => props,
      structure.reduce((acc, cur) => ({ ...acc, ...cur }), {}),
    );

    structure.forEach((step) => {
      toPairs(step).forEach(([fieldName, { props }]) => {
        initialState[fieldName] = props;
      });
    });

    this._atom = declareAtom('props.atom', initialState, (on) => [
      on(changeFieldProps, (state, payload) => {
        const prevProps = state[payload.name];

        return {
          ...state,
          [payload.name]: {
            ...prevProps,
            ...payload.value,
          },
        };
      }),
    ]);
    this._rxStore = toRxStore(this._globalStore, this._atom);

    // @TODO so that all the methods apply on first render
    this._globalStore.subscribe(this._atom, noop);
  }

  setFieldProp(name: string, value: Props) {
    this._globalStore.dispatch(changeFieldProps({ name, value }));
  }

  getAtom() {
    return this._atom;
  }

  getRxStore() {
    return this._rxStore;
  }
}

export const PropsProvider: TProviderConfig<PropsService> = {
  name: 'props',
  useService: PropsService,
};

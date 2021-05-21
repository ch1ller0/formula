import toPairs from '@tinkoff/utils/object/toPairs';
import { declareAction, declareAtom } from '@reatom/core';

import type {
  TProviderConfig,
  TProviderService,
  TFeatureConstructorArgs,
} from '../features.type';
import type { Atom } from '@reatom/core';
import { toRxStore } from '../../base/store';

type Props = Record<string, unknown>;
type State = Record<string, Props>;

const changeFieldProps = declareAction<{
  name: string;
  value: Props;
}>('props.changeFieldProps');

class PropsService implements TProviderService {
  private readonly _atom: Atom<State>;
  private readonly _globalStore: TFeatureConstructorArgs['globalStore'];

  constructor({ structure, globalStore }: TFeatureConstructorArgs) {
    this._globalStore = globalStore;
    const initialState = {} as State;

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
  }

  setFieldProp(name: string, value: Props) {
    // @TODO remove this crutch
    setTimeout(() => {
      this._globalStore.dispatch(changeFieldProps({ name, value }));
    });
  }

  getAtom() {
    return this._atom;
  }

  getRxStore() {
    return toRxStore(this._globalStore, this._atom);
  }
}

export const PropsFeature: TProviderConfig<PropsService> = {
  name: 'props',
  useService: PropsService,
};

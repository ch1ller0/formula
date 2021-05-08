import { globalStore } from '../../base/store';
import toPairs from '@tinkoff/utils/object/toPairs';
import { Atom, declareAction, declareAtom } from '@reatom/core';

import type {
  TFeatureConfig,
  TFeatureService,
  TFeatureConstructorArgs,
} from '../features.type';

type Props = Record<string, unknown>;
type State = Record<string, Props>;

const changeFieldProps = declareAction<{
  name: string;
  value: Props;
}>('change-field-props.action');

class PropsService implements TFeatureService {
  private readonly _atom: Atom<State>;

  constructor({ structure }: TFeatureConstructorArgs) {
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
      globalStore.dispatch(changeFieldProps({ name, value }));
    });
  }

  getAtom() {
    return this._atom;
  }
}

export const PropsFeature: TFeatureConfig = {
  name: 'props',
  useService: PropsService,
};

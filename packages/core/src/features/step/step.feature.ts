import { declareAction, declareAtom } from '@reatom/core';
import { PropsFeature } from '../props/props.feature';

import type { Atom } from '@reatom/core';
import type {
  TFeatureConfig,
  TFeatureService,
  TFeatureConstructorArgs,
} from '../features.type';

const stepIncrement = declareAction('step.stepIncrement');
class StepService implements TFeatureService {
  private readonly _globalStore: TFeatureConstructorArgs['globalStore'];
  private readonly _atom: Atom<number>;
  private readonly _propsService: TFeatureConstructorArgs['deps'][0];

  constructor({ deps, globalStore }: TFeatureConstructorArgs) {
    const [propsService] = deps;

    this._atom = declareAtom<number>('step.atom', 0, (on) => [
      on(stepIncrement, (state) => state + 1),
    ]);
    this._propsService = propsService;
    this._globalStore = globalStore;
  }

  getAtom() {
    return this._atom;
  }

  bindNextStep() {
    return ({ initiator }) => {
      this._propsService.setFieldProp(initiator.fieldName, {
        onAction: () => {
          this._globalStore.dispatch(stepIncrement());
        },
      });
    };
  }
}

export const StepFeature: TFeatureConfig = {
  name: 'step',
  useService: StepService,
  deps: [PropsFeature],
};

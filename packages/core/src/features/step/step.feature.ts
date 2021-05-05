import { declareAction, declareAtom } from '@reatom/core';
import { PropsFeature } from '../props/props.feature';
import type {
  FeatureConfig,
  FeatureService,
  FeatureConstructorArgs,
} from '../features.type';

const stepIncrement = declareAction('step-increment');

class StepService implements FeatureService {
  private readonly _globalStore: FeatureConstructorArgs['globalStore'];
  private readonly _atom: any;
  private readonly _propsService: FeatureConstructorArgs['deps'][0];

  constructor({ deps, globalStore }: FeatureConstructorArgs) {
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
      this._propsService.setFieldProp({
        name: initiator.fieldName,
        value: {
          onAction: () => {
            this._globalStore.dispatch(stepIncrement());
          },
        },
      });
    };
  }
}

export const StepFeature: FeatureConfig = {
  name: 'step',
  useService: StepService,
  deps: [PropsFeature],
};

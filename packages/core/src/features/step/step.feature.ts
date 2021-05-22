import { declareAction, declareAtom } from '@reatom/core';
import { PropsFeature } from '../props/props.feature';
import { toRxStore } from '../../base/store';

import type { Atom } from '@reatom/core';
import type {
  TProviderConfig,
  TProviderService,
  TProviderConsturctorArgs,
  TToProviderInstance,
} from '../features.type';

const stepIncrement = declareAction('step.stepIncrement');
class StepService implements TProviderService {
  private readonly _globalStore: TProviderConsturctorArgs['globalStore'];
  private readonly _atom: Atom<number>;
  private readonly _propsService: TToProviderInstance<typeof PropsFeature>;

  constructor({ deps, globalStore }: TProviderConsturctorArgs) {
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

  getRxStore() {
    return toRxStore(this._globalStore, this._atom);
  }
}

export const StepFeature: TProviderConfig<StepService> = {
  name: 'step',
  useService: StepService,
  deps: [PropsFeature],
};

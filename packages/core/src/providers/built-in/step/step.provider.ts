import { declareAction, declareAtom } from '@reatom/core';
import noop from '@tinkoff/utils/function/noop';
import { PropsProvider } from '../props.provider';
import { toRxStore } from '../../../base/store';
import { StepWrapperFabric } from './step.gen';

import type { Atom } from '@reatom/core';
import type {
  TProviderConfig,
  TProviderService,
  TProviderConsturctorArgs,
  TToProviderInstance,
} from '../../../types/provider.types';

const stepIncrement = declareAction('step.stepIncrement');
class StepService implements TProviderService {
  private readonly _globalStore: TProviderConsturctorArgs['globalStore'];
  private readonly _atom: Atom<number>;
  private readonly _propsService: TToProviderInstance<typeof PropsProvider>;

  constructor({ deps, globalStore }: TProviderConsturctorArgs) {
    const [propsService] = deps;

    this._atom = declareAtom<number>('step.atom', 0, (on) => [
      on(stepIncrement, (state) => state + 1),
    ]);
    this._propsService = propsService;
    this._globalStore = globalStore;
    this._globalStore.subscribe(this._atom, noop);
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

  renderWrapper() {
    return StepWrapperFabric(this._atom);
  }
}

export const StepProvider: TProviderConfig<StepService> = {
  name: 'step',
  useService: StepService,
  deps: [PropsProvider],
};

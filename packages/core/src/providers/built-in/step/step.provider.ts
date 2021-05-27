import { PropsProvider } from '../';
import { StepWrapperFabric } from './step.gen';
import { useState } from './step.state';

import type {
  TProviderConfig,
  TProviderService,
  TProviderConsturctorArgs,
  TToProviderInstance,
} from '../../../types/provider.types';

class StepService implements TProviderService {
  private readonly _selfState: ReturnType<typeof useState>;
  private readonly _propsService: TToProviderInstance<typeof PropsProvider>;

  constructor(args: TProviderConsturctorArgs) {
    const [propsService] = args.deps;
    this._propsService = propsService;
    this._selfState = useState(args);
  }

  useBinders() {
    return {
      nextStep: () => (fieldName: string) => {
        this._propsService.setFieldProp(fieldName, {
          onAction: () => {
            this._selfState.actions.stepIncrement();
          },
        });
      },
    };
  }

  getRxStore() {
    return this._selfState.rx;
  }

  renderWrapper() {
    return StepWrapperFabric(this._selfState._atom);
  }
}

export const StepProvider: TProviderConfig<StepService> = {
  name: 'step',
  useService: StepService,
  deps: [PropsProvider],
};

import { filter } from 'rxjs/operators';
import { FieldProvider } from '../';
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
  private readonly _fieldService: TToProviderInstance<typeof FieldProvider>;

  constructor(args: TProviderConsturctorArgs) {
    const [fieldService] = args.deps;
    this._fieldService = fieldService;
    this._selfState = useState(args);
  }

  useBinders() {
    return {
      nextStep: () => (fieldName: string) => {
        this._fieldService
          .getDiffRx()
          // watch only for this button clicked
          .pipe(filter(({ name }) => name === fieldName))
          .subscribe(() => {
            this._selfState.actions.stepIncrement();
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
  deps: [FieldProvider],
};

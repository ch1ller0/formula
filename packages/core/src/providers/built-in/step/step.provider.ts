import {
  distinctUntilChanged,
  filter,
  mapTo,
  sample,
  map,
} from 'rxjs/operators';
import { FieldProvider } from '../';
import { StepWrapperFabric } from './step.gen';
import { useState, SetBlockArgs } from './step.state';

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
        const buttonClick$ = this._fieldService.getDiffRx().pipe(
          // watch only for this button clicked
          filter(({ name }) => name === fieldName),
          // need nothing from data - only timings
          mapTo(`click$:${fieldName}`),
        );

        this._selfState.rx
          .pipe(
            // @TODO need optimization - value should not be emitted if states are equal
            distinctUntilChanged(),
            // emit only when button pressed
            sample(buttonClick$),
            // get boolean of ability to go to next step
            map(({ currentStep, blocked }) => blocked[currentStep]),
          )
          .subscribe((stepBlocked) => {
            if (!stepBlocked) {
              this._selfState.actions.stepIncrement();
            }
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

  setBlocked(args: SetBlockArgs) {
    this._selfState.actions.stepBlock(args);
  }
}

export const StepProvider: TProviderConfig<StepService> = {
  name: 'step',
  useService: StepService,
  deps: [FieldProvider],
};

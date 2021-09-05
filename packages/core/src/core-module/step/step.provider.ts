import {
  distinctUntilChanged,
  filter,
  mapTo,
  sample,
  map,
} from 'rxjs/operators';
import { useState } from './step.state';
import {
  FIELD_SERVICE_TOKEN,
  GLOBAL_STORE_TOKEN,
  STEP_SERVICE_TOKEN,
} from '../tokens';

import type { TStepService, SetBlockArgs } from './step.types';
import type { TFieldService } from '../field/field.types';
import type { Provider } from '@formula/ioc';
import type { GlobalStore } from '../global-store/global-store.types';

class StepService implements TStepService {
  private readonly _selfState: ReturnType<typeof useState>;
  private readonly _fieldService: TFieldService;

  constructor(deps: [TFieldService, GlobalStore]) {
    const [fieldService, globalStore] = deps;
    this._fieldService = fieldService;
    this._selfState = useState(globalStore);
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

  setBlocked(args: SetBlockArgs) {
    this._selfState.actions.stepBlock(args);
  }

  _getRenderDeps() {
    return { atom: this._selfState._atom };
  }
}

export const stepProvider: Provider = {
  provide: STEP_SERVICE_TOKEN,
  useClass: StepService,
  deps: [FIELD_SERVICE_TOKEN, GLOBAL_STORE_TOKEN],
};

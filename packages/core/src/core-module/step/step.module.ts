import { distinctUntilChanged, filter, mapTo, sample, map } from 'rxjs/operators';
import { FIELD_SERVICE_TOKEN, GLOBAL_STORE_TOKEN, STEP_SERVICE_TOKEN } from '../tokens';
import { useState } from './step.state';
import type { ExtractToken, Provider } from '@formula/ioc';
import type { SetBlockArgs, StepService } from './step.types';

const stepFactory = (deps: [ExtractToken<typeof FIELD_SERVICE_TOKEN>, ExtractToken<typeof GLOBAL_STORE_TOKEN>]) => {
  const [fieldService, globalStore] = deps;
  const selfState = useState(globalStore);

  return {
    useBinders: {
      nextStep: () => (fieldName: string) => {
        const buttonClick$ = fieldService.getDiffRx().pipe(
          // watch only for this button clicked
          filter(({ name }) => name === fieldName),
          // need nothing from data - only timings
          mapTo(`click$:${fieldName}`),
        );

        selfState.rx
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
              selfState.actions.stepIncrement();
            }
          });
      },
    },
    setBlocked: (args: SetBlockArgs) => {
      selfState.actions.stepBlock(args);
    },
    getRxStore: () => selfState.rx,
    _getRenderDeps: () => ({ atom: selfState._atom }),
  };
};

const stepProvider: Provider<StepService> = {
  provide: STEP_SERVICE_TOKEN,
  useFactory: stepFactory,
  deps: [FIELD_SERVICE_TOKEN, GLOBAL_STORE_TOKEN],
};

export const StepModule = [stepProvider];

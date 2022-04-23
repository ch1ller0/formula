import { distinctUntilChanged, filter, mapTo, sample, map } from 'rxjs/operators';
import { injectable } from '@fridgefm/inverter';
import { FIELD_SERVICE_TOKEN, GLOBAL_STORE_TOKEN, STEP_SERVICE_TOKEN, STEP_BINDERS_TOKEN } from './tokens';
import { useState } from './step.state';

export const stepProviders = [
  injectable({
    provide: STEP_BINDERS_TOKEN,
    useFactory: (stepService, fieldService) => {
      return {
        nextStep: () => (fieldName) => {
          const buttonClick$ = fieldService.getDiffRx().pipe(
            // watch only for this button clicked
            filter(({ name }) => name === fieldName),
            // need nothing from data - only timings
            mapTo(`click$:${fieldName}`),
          );

          stepService
            .getRxStore()
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
                stepService.stepIncrement();
              }
            });
        },
      };
    },
    inject: [STEP_SERVICE_TOKEN, FIELD_SERVICE_TOKEN] as const,
  }),
  injectable({
    provide: STEP_SERVICE_TOKEN,
    useFactory: (globalStore) => {
      const selfState = useState(globalStore);

      return {
        stepBlock: selfState.actions.stepBlock,
        stepIncrement: selfState.actions.stepIncrement,
        getRxStore: () => selfState.rx,
        _getRenderDeps: () => ({ atom: selfState._atom }),
      };
    },
    inject: [GLOBAL_STORE_TOKEN] as const,
  }),
];

import {
  distinctUntilChanged,
  filter,
  mapTo,
  sample,
  map,
} from 'rxjs/operators';
import mapObj from '@tinkoff/utils/object/map';
import eachObj from '@tinkoff/utils/object/each';
import keys from '@tinkoff/utils/object/keys';
import toPairs from '@tinkoff/utils/object/toPairs';
import { useState } from './step.state';
import {
  StructureProvider,
  TStructureService,
  FieldProvider,
  TFieldService,
} from '../index';

import type {
  TProviderConfig,
  TProviderConsturctorArgs,
} from '../../types/provider.types';
import type { TStepService, SetBlockArgs } from './step.types';
import { Observable } from 'rxjs';

class StepService implements TStepService {
  private readonly _selfState: ReturnType<typeof useState>;
  private readonly _fieldService: TFieldService;
  private readonly _structureService: TStructureService;

  constructor(
    args: TProviderConsturctorArgs<[TFieldService, TStructureService]>,
  ) {
    const [fieldService, structureService] = args.deps;
    this._fieldService = fieldService;
    this._structureService = structureService;
    this._selfState = useState(args);
  }
  getCurrentScreenFields(fieldName: string): Observable<string[]> {
    throw new Error('Method not implemented.');
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

export const StepProvider: TProviderConfig<StepService> = {
  name: 'step',
  useService: StepService,
  deps: [FieldProvider, StructureProvider],
};

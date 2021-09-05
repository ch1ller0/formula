import {
  distinctUntilKeyChanged,
  debounceTime,
  filter,
  pluck,
  mergeMap,
  map,
  skip,
  distinctUntilChanged,
} from 'rxjs/operators';
import keys from '@tinkoff/utils/object/keys';
import filterObj from '@tinkoff/utils/object/filter';
import eachObj from '@tinkoff/utils/object/each';
import { combineLatest } from 'rxjs';
import { CoreTokens } from '@formula/core';
import { createToken } from '@formula/ioc';
// @ts-ignore

import { allScreenFields } from '../../core/src/core-module/structure/structure.selector';
import { useState } from './validation.state';
import type { TFieldService } from '@formula/core/src/core-module/field/field.types';
import type { TPropsService } from '@formula/core/src/core-module/props/props.types';
import type { TStepService } from '@formula/core/src/core-module/step/step.types';
import type { TStructureService } from '@formula/core/src/core-module/structure/structure.types';
import type { Provider } from '@formula/ioc';
import type { GlobalStore } from '@formula/core/src/core-module/global-store/global-store.types';
import type { TValidationService, ValidateFn } from './validation.types';

const {
  FIELD_SERVICE_TOKEN,
  PROPS_SERVICE_TOKEN,
  STEP_SERVICE_TOKEN,
  STRUCTURE_SERVICE_TOKEN,
  GLOBAL_STORE_TOKEN,
} = CoreTokens;

class ValidationService implements TValidationService {
  private readonly _fieldService: TFieldService;

  private readonly _propsService: TPropsService;

  private readonly _stepService: TStepService;

  private readonly _structureService: TStructureService;

  private readonly _selfState: ReturnType<typeof useState>;

  constructor(deps: [TFieldService, TPropsService, TStepService, TStructureService, GlobalStore]) {
    const [fieldService, propsService, stepService, structureService, globalStore] = deps;
    this._selfState = useState(globalStore);

    this._fieldService = fieldService;
    this._propsService = propsService;
    this._stepService = stepService;
    this._structureService = structureService;
  }

  useBinders() {
    return {
      validateField: (validateFns: ValidateFn[]) => (fieldName: string) => {
        this._fieldService
          .getRxStore()
          .pipe(
            // filtering field we are interested in
            distinctUntilKeyChanged(fieldName),
            debounceTime(100),
            pluck(fieldName),
            mergeMap((nextValue) =>
              // apply validator functions
              Promise.all(validateFns.map((v) => v(nextValue))).then((a) => a.filter((x) => !!x)),
            ),
          )
          .subscribe((errors) => {
            this._selfState.actions.validateAction({ name: fieldName, errors });
          });
      },
      stepDisabled: () => (buttonName: string) => {
        this._propsService.setFieldProp(buttonName, { disabled: true });

        // stream of requirements for screen to be passed
        const screenValidationRequirements$ = this._structureService
          .getRxStore()
          .pipe(map((s) => allScreenFields(s).find((sa) => sa[1].includes(buttonName))));

        // stream of button clicks
        const buttonClick$ = this._fieldService.getDiffRx().pipe(filter(({ name }) => name === buttonName));

        // stream of current screen validation map
        const currentScreenValidation$ = combineLatest([screenValidationRequirements$, this._selfState.rx]).pipe(
          map(([stepValidationRequirements, validationState]) => ({
            screenName: stepValidationRequirements?.[0],
            screenValidation: filterObj(
              (_, key) => (stepValidationRequirements?.[1] || []).includes(key),
              validationState,
            ),
          })),
          distinctUntilChanged(),
        );

        // setting errors for current step fields
        // combine button clicks with step`s validation state
        // starts emitting after button was clicked once
        combineLatest([currentScreenValidation$, buttonClick$])
          .pipe(map((v) => v[0]))
          .subscribe(({ screenValidation }) =>
            eachObj((errors, fieldName) => {
              this._propsService.setFieldProp(fieldName, {
                error: errors?.[0],
              });
            }, screenValidation),
          );

        // setting button validation view
        currentScreenValidation$
          .pipe(
            // skip initial validation state - it is not ready yet
            skip(1),
            debounceTime(100),
            map(({ screenName, screenValidation }) => ({
              screenName,
              isDisabled: keys(screenValidation).some((key) => !!screenValidation[key]?.length),
            })),
          )
          .subscribe(({ screenName, isDisabled }) => {
            const stepNum = screenName?.replace('scr.', '');

            if (stepNum !== undefined) {
              this._stepService.setBlocked({
                stepNum, // @TODO replace step provider with screen provider
                value: isDisabled,
              });
            }

            this._propsService.setFieldProp(buttonName, {
              disabled: isDisabled,
            });
          });
      },
    };
  }
}

export const VALIDATION_SERVICE_TOKEN = createToken('validation-service');

export const ValidationProvider: Provider = {
  provide: VALIDATION_SERVICE_TOKEN,
  useClass: ValidationService,
  deps: [FIELD_SERVICE_TOKEN, PROPS_SERVICE_TOKEN, STEP_SERVICE_TOKEN, STRUCTURE_SERVICE_TOKEN, GLOBAL_STORE_TOKEN],
};

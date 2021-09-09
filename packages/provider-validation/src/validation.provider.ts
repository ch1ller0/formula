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

// @ts-ignore @TODO remove this import
import { allScreenFields } from '../../core/src/core-module/structure/structure.selector';
import { useState } from './validation.state';
import type { Provider, ExtractToken } from '@formula/ioc';
import type { ValidateFn } from './validation.types';

const {
  FIELD_SERVICE_TOKEN,
  PROPS_SERVICE_TOKEN,
  STEP_SERVICE_TOKEN,
  STRUCTURE_SERVICE_TOKEN,
  GLOBAL_STORE_TOKEN,
} = CoreTokens;

const validationFactory = (
  deps: [
    ExtractToken<typeof FIELD_SERVICE_TOKEN>,
    ExtractToken<typeof PROPS_SERVICE_TOKEN>,
    ExtractToken<typeof STEP_SERVICE_TOKEN>,
    ExtractToken<typeof STRUCTURE_SERVICE_TOKEN>,
    ExtractToken<typeof GLOBAL_STORE_TOKEN>,
  ],
) => {
  const [fieldService, propsService, stepService, structureService, globalStore] = deps;
  const selfState = useState(globalStore);

  return {
    useBinders: () => ({
      validateField: (validateFns: ValidateFn[]) => (fieldName: string) => {
        fieldService
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
            selfState.actions.validateAction({ name: fieldName, errors });
          });
      },
      stepDisabled: () => (buttonName: string) => {
        propsService.setFieldProp(buttonName, { disabled: true });

        // stream of requirements for screen to be passed
        const screenValidationRequirements$ = structureService
          .getRxStore()
          .pipe(map((s) => allScreenFields(s).find((sa) => sa[1].includes(buttonName))));

        // stream of button clicks
        const buttonClick$ = fieldService.getDiffRx().pipe(filter(({ name }) => name === buttonName));

        // stream of current screen validation map
        const currentScreenValidation$ = combineLatest([screenValidationRequirements$, selfState.rx]).pipe(
          map(([stepValidationRequirements, validationState]) => ({
            screenName: stepValidationRequirements?.[0],
            screenValidation: filterObj(
              // @ts-ignore
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
              propsService.setFieldProp(fieldName, {
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
              stepService.setBlocked({
                stepNum, // @TODO replace step provider with screen provider
                value: isDisabled,
              });
            }

            propsService.setFieldProp(buttonName, {
              disabled: isDisabled,
            });
          });
      },
    }),
  };
};

type ValidationFactory = ReturnType<typeof validationFactory>;

export const VALIDATION_SERVICE_TOKEN = createToken<ValidationFactory>('validation-factory');

export const ValidationProvider: Provider<ValidationFactory> = {
  provide: VALIDATION_SERVICE_TOKEN,
  useFactory: validationFactory,
  deps: [FIELD_SERVICE_TOKEN, PROPS_SERVICE_TOKEN, STEP_SERVICE_TOKEN, STRUCTURE_SERVICE_TOKEN, GLOBAL_STORE_TOKEN],
};

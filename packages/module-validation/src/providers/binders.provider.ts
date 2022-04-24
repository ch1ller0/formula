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
import { CoreTokens } from '@formula/module-core';
import { injectable } from '@fridgefm/inverter';
import { VALIDATION_BINDERS_TOKEN, VALIDATION_STATE_TOKEN } from '../tokens';

import type { ValidateFn } from '../types';

export const validationBindersProvider = injectable({
  provide: VALIDATION_BINDERS_TOKEN,
  useFactory: (fieldService, propsService, screenService, structureService, selfState) => ({
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
            Promise.all(validateFns.map((v) => v(nextValue))).then((a) => a.filter((x) => !!x) as string[]),
          ),
        )
        .subscribe((errors) => {
          selfState.validate({ name: fieldName, errors });
        });
    },
    screenDisabled: () => (buttonName: string) => {
      const { allScreenFields } = structureService.selectors;
      propsService.setFieldProps(buttonName, { disabled: true });

      // stream of requirements for screen to be passed
      const screenValidationRequirements$ = structureService
        .getRxStore()
        .pipe(map((s) => allScreenFields(s).find((sa) => sa[1].includes(buttonName))));
      // stream of button clicks
      const buttonClick$ = fieldService.getDiffRx().pipe(filter(({ fieldName }) => fieldName === buttonName));

      // stream of current screen validation map
      const currentScreenValidation$ = combineLatest([screenValidationRequirements$, selfState.rx]).pipe(
        map(([screenValidationRequirements, validationState]) => ({
          screenName: screenValidationRequirements?.[0],
          screenValidation: filterObj(
            // @ts-ignore
            (_, key) => (screenValidationRequirements?.[1] || []).includes(key),
            validationState,
          ),
        })),
        distinctUntilChanged(),
      );

      // setting errors for current screen fields
      // combine button clicks with screen`s validation state
      // starts emitting after button was clicked once
      combineLatest([currentScreenValidation$, buttonClick$])
        .pipe(map((v) => v[0]))
        .subscribe(({ screenValidation }) =>
          eachObj((errors, fieldName) => {
            propsService.setFieldProps(fieldName, {
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
            screenService.blockScreen({
              screenNum: stepNum, // @TODO replace screen provider with screen provider
              value: isDisabled,
            });
          }

          propsService.setFieldProps(buttonName, {
            disabled: isDisabled,
          });
        });
    },
  }),
  inject: [
    CoreTokens.FIELD_SERVICE_TOKEN,
    CoreTokens.PROPS_SERVICE_TOKEN,
    CoreTokens.SCREEN_SERVICE_TOKEN,
    CoreTokens.STRUCTURE_SERVICE_TOKEN,
    VALIDATION_STATE_TOKEN,
  ] as const,
});

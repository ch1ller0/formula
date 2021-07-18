import {
  distinctUntilKeyChanged,
  debounceTime,
  filter,
  pluck,
  mergeMap,
  map,
  skip,
  distinctUntilChanged,
  startWith,
} from 'rxjs/operators';
import keys from '@tinkoff/utils/object/keys';
import filterObj from '@tinkoff/utils/object/filter';
import eachObj from '@tinkoff/utils/object/each';
import { combineLatest } from 'rxjs';
import { BuiltInProviders } from '@formula/core';
import { useState } from './validation.state';
import { allScreenFields } from '../../core/src/core-providers/structure/structure.selector';

import type { TProvider, TBase } from '@formula/core';
import type { TValidationService } from './validation.types';
import {
  TFieldService,
  TPropsService,
  TStepService,
  TStructureService,
} from 'packages/core/src/core-providers/';

const {
  FieldProvider,
  PropsProvider,
  StepProvider,
  StructureProvider,
} = BuiltInProviders;

type ValidateFn = (v: TBase.TPrimitive) => string | Promise<string>;

class ValidationService implements TValidationService {
  private readonly _fieldService: TFieldService;
  private readonly _propsService: TPropsService;
  private readonly _stepService: TStepService;
  private readonly _structureService: TStructureService;
  private readonly _selfState: ReturnType<typeof useState>;

  constructor(
    args: TProvider.TProviderConsturctorArgs<
      [TFieldService, TPropsService, TStepService, TStructureService]
    >,
  ) {
    const [
      fieldService,
      propsService,
      stepService,
      structureService,
    ] = args.deps;
    this._selfState = useState(args);

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
              Promise.all(validateFns.map((v) => v(nextValue))).then((a) =>
                a.filter((x) => !!x),
              ),
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
          .pipe(
            map((s) =>
              allScreenFields(s).find((s) => s[1].includes(buttonName)),
            ),
          );

        // stream of button clicks
        const buttonClick$ = this._fieldService
          .getDiffRx()
          .pipe(filter(({ name }) => name === buttonName));

        // stream of current screen validation map
        const currentScreenValidation$ = combineLatest([
          screenValidationRequirements$,
          this._selfState.rx,
        ]).pipe(
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
              isDisabled: keys(screenValidation).some(
                (key) => !!screenValidation[key]?.length,
              ),
            })),
          )
          .subscribe(({ screenName, isDisabled }) => {
            const stepNum = screenName?.replace('scr.', '');

            stepNum !== undefined &&
              this._stepService.setBlocked({
                stepNum, // @TODO replace step provider with screen provider
                value: isDisabled,
              });

            this._propsService.setFieldProp(buttonName, {
              disabled: isDisabled,
            });
          });
      },
    };
  }
}

export const ValidationProvider: TProvider.TProviderConfig<ValidationService> = {
  name: 'validation',
  useService: ValidationService,
  deps: [FieldProvider, PropsProvider, StepProvider, StructureProvider],
};

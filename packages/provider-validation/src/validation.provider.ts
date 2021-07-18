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

import type { TProvider, TBase } from '@formula/core';
import type { TValidationService } from './validation.types';
import type {
  TFieldService,
  TPropsService,
  TStepService,
  TStructureService,
} from 'packages/core/src/core-providers/';

const { FieldProvider, PropsProvider, StepProvider } = BuiltInProviders;

type ValidateFn = (v: TBase.TPrimitive) => string | Promise<string>;

class ValidationService implements TValidationService {
  private readonly _fieldService: TFieldService;
  private readonly _propsService: TPropsService;
  private readonly _stepService: TStepService;
  // private readonly _structureService: TStructureService;
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
      // structureService,
    ] = args.deps;
    this._selfState = useState(args);

    this._fieldService = fieldService;
    this._propsService = propsService;
    this._stepService = stepService;
    // this._structureService = structureService;
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
        // this._stepService.getScreenFields();
        // this._structureService.getRxStore?.().subscribe((e) => {
        //   console.log('e', e);
        // });

        const stepValidationRequirements = this._stepService.findFields(
          buttonName,
        );

        this._propsService.setFieldProp(buttonName, { disabled: true });

        const buttonClick$ = this._fieldService
          .getDiffRx()
          // filter current button click
          .pipe(filter(({ name }) => name === buttonName));

        const currentStepValidation$ = this._selfState.rx.pipe(
          map((validationState) =>
            filterObj(
              (_, key) => (stepValidationRequirements?.[1] || []).includes(key),
              validationState,
            ),
          ),
          distinctUntilChanged(),
        );
        // setting errors for current step fields
        // combine button clicks with step`s validation state
        // starts emitting after button was clicked once
        combineLatest([currentStepValidation$, buttonClick$])
          .pipe(map((v) => v[0]))
          .subscribe((stepValidation) =>
            eachObj((errors, fieldName) => {
              this._propsService.setFieldProp(fieldName, {
                error: errors?.[0],
              });
            }, stepValidation),
          );
        // setting button validation view
        currentStepValidation$
          .pipe(
            // skip initial validation state - it is not ready yet
            skip(1),
            debounceTime(100),
            map((stepValidation) =>
              keys(stepValidation).some((key) => !!stepValidation[key]?.length),
            ),
            startWith(true),
          )
          .subscribe((disabled) => {
            const stepNum = stepValidationRequirements?.[0];
            stepNum &&
              this._stepService.setBlocked({
                stepNum,
                value: disabled,
              });

            this._propsService.setFieldProp(buttonName, { disabled });
          });
      },
    };
  }
}

export const ValidationProvider: TProvider.TProviderConfig<ValidationService> = {
  name: 'validation',
  useService: ValidationService,
  deps: [FieldProvider, PropsProvider, StepProvider],
};

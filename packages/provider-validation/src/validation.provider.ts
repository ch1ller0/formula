import {
  distinctUntilKeyChanged,
  distinctUntilChanged,
  debounceTime,
  map,
  startWith,
  filter,
  skip,
} from 'rxjs/operators';
import keys from '@tinkoff/utils/object/keys';
import { BuiltInProviders } from '@formula/core';
import { useState } from './validation.state';

import type { TProvider, TBase } from '@formula/core';
import type { TToProviderInstance } from 'packages/core/src/types/provider.types';

const { FieldProvider, PropsProvider } = BuiltInProviders;

type ValidateFn = (v: TBase.TPrimitive) => string | Promise<string>;

class ValidationService implements TProvider.TProviderService {
  private readonly _structure: TProvider.TProviderConsturctorArgs['structure'];
  private readonly _fieldService: TToProviderInstance<typeof FieldProvider>;
  private readonly _propsService: TToProviderInstance<typeof PropsProvider>;
  private readonly _selfState: ReturnType<typeof useState>;

  constructor(args: TProvider.TProviderConsturctorArgs) {
    const [fieldService, propsService] = args.deps;
    this._structure = args.structure;
    this._selfState = useState(args);

    this._fieldService = fieldService;
    this._propsService = propsService;
  }

  useBinders() {
    return {
      validateField: (validateFns: ValidateFn[]) => (fieldName: string) => {
        this._fieldService
          .getRxStore()
          .pipe(
            // filtering field we are interested in
            distinctUntilKeyChanged(fieldName),
            // skipping initial field state emit
            skip(1),
            debounceTime(30),
          )
          .subscribe(async (nextValue) => {
            const currentValue = nextValue[fieldName];
            if (currentValue === null) {
              return;
            }
            const errors = await Promise.all(
              validateFns.map((v) => v(currentValue)),
            ).then((a) => a.filter((x) => !!x));

            this._selfState.actions.validateAction({ name: fieldName, errors });
            this._propsService.setFieldProp(fieldName, { error: errors[0] });
          });
      },
      stepDisabled: () => (fieldName: string) => {
        const fieldsByStep = this._structure.map(keys);

        const stepValidationRequirements =
          fieldsByStep.find((v) => v.includes(fieldName)) || [];

        this._selfState.rx
          .pipe(
            distinctUntilChanged(),
            filter((v) =>
              keys(v).some((fieldName) =>
                stepValidationRequirements.includes(fieldName),
              ),
            ),
            map((v) => stepValidationRequirements.some((x) => v[x]?.length)),
            distinctUntilChanged(),
            startWith(true), // disable at first render
          )
          .subscribe((disabled) => {
            this._propsService.setFieldProp(fieldName, { disabled });
          });
      },
    };
  }
}

export const ValidationProvider: TProvider.TProviderConfig<ValidationService> = {
  name: 'validation',
  useService: ValidationService,
  deps: [FieldProvider, PropsProvider],
};

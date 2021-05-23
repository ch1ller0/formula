import {
  distinctUntilKeyChanged,
  distinctUntilChanged,
  debounceTime,
  map,
  startWith,
  filter,
  skip,
} from 'rxjs/operators';
import { declareAction, declareAtom } from '@reatom/core';
import keys from '@tinkoff/utils/object/keys';
import noop from '@tinkoff/utils/function/noop';
import { toRxStore } from '../../base/store';
import { PropsProvider, FieldProvider } from '../built-in/index';

import type {
  TProviderConfig,
  TProviderConsturctorArgs,
  TProviderService,
  TToProviderInstance,
} from '../../types/provider.types';
import type { Atom } from '@reatom/core';
import type { TPrimitive } from '../../types/base.types';

type State = Record<string, string[]>;
type ValidateFn = (v: TPrimitive) => string | Promise<string>;

const validateAction = declareAction<{
  name: string;
  errors: string[];
}>('validation.validateAction');

class ValidationService implements TProviderService {
  private readonly _atom: Atom<State>;
  private readonly _globalStore: TProviderConsturctorArgs['globalStore'];
  private readonly _structure: TProviderConsturctorArgs['structure'];
  private readonly _fieldRx: ReturnType<
    TToProviderInstance<typeof FieldProvider>['getRxStore']
  >;

  constructor({ structure, deps, globalStore }: TProviderConsturctorArgs) {
    const [fieldService, propsService] = deps;
    this._structure = structure;
    this._fieldRx = fieldService.getRxStore();
    this._propsService = propsService;
    this._globalStore = globalStore;
    this._atom = declareAtom<State>(['validation'], {}, (on) => [
      on(validateAction, (state, payload) => ({
        ...state,
        [payload.name]: payload.errors,
      })),
    ]);
    this._globalStore.subscribe(this._atom, noop);
  }

  bindDisabled() {
    const fieldsByStep = this._structure.map(keys);

    return ({ initiator: { fieldName } }) => {
      const stepValidationRequirements =
        fieldsByStep.find((v) => v.includes(fieldName)) || [];

      toRxStore(this._globalStore, this._atom)
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
    };
  }

  bindValidation(validateFns: ValidateFn[]) {
    return ({ initiator: { fieldName } }) => {
      this._fieldRx
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

          this._globalStore.dispatch(
            validateAction({ name: fieldName, errors }),
          );

          this._propsService.setFieldProp(fieldName, { error: errors[0] });
        });
    };
  }

  getRxStore() {
    return toRxStore(this._globalStore, this._atom);
  }
}

export const ValidationProvider: TProviderConfig<ValidationService> = {
  name: 'validation',
  useService: ValidationService,
  deps: [FieldProvider, PropsProvider],
};

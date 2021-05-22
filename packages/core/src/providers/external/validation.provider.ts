import {
  distinctUntilKeyChanged,
  distinctUntilChanged,
  debounceTime,
  map,
  startWith,
  filter,
} from 'rxjs/operators';
import { declareAction, declareAtom } from '@reatom/core';
import keys from '@tinkoff/utils/object/keys';
import { toRxStore } from '../../base/store';
import { PropsProvider, FieldProvider } from '../built-in/index';

import type {
  TProviderConfig,
  TProviderConsturctorArgs,
  TProviderService,
  TToProviderInstance,
} from '../provider.type';
import type { Atom } from '@reatom/core';
import type { TPrimitive } from '../../types';

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
    this._atom = declareAtom<State>('validation.atom', {}, (on) => [
      on(validateAction, (state, payload) => ({
        ...state,
        [payload.name]: payload.errors,
      })),
    ]);
  }

  toggleDisabled() {
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

  validate(validateFns: ValidateFn[]) {
    return ({ initiator: { fieldName } }) => {
      this._globalStore.dispatch(
        validateAction({ name: fieldName, errors: [] }),
      );

      this._fieldRx
        .pipe(distinctUntilKeyChanged(fieldName), debounceTime(300))
        .subscribe(async (nextValue) => {
          const currentValue = nextValue[fieldName];
          if (currentValue === undefined) {
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

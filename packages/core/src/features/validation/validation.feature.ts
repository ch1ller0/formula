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
import { FieldFeature, PropsFeature } from '../index';

import type {
  TFeatureConfig,
  TFeatureConstructorArgs,
  TFeatureService,
} from '../features.type';
import type { Atom } from '@reatom/core';

type State = Record<string, { error: string }>;

const validateAction = declareAction<{
  name: string;
  errors: string[];
}>('validation-change.action');

type ValidateFn = (v: string | number) => string | Promise<string>;

class ValidationService implements TFeatureService {
  _atom: Atom<State>;

  constructor({ structure, deps, globalStore }: TFeatureConstructorArgs) {
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
      const stepValidationRequirements = fieldsByStep.find((v) =>
        v.includes(fieldName),
      );

      toRxStore(this._atom)
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
}

export const ValidationFeature: TFeatureConfig = {
  name: 'validation',
  useService: ValidationService,
  deps: [FieldFeature, PropsFeature],
};

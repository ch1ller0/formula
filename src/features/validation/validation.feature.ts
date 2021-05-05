import { fieldAtom } from '../field/field.atom';
import { validateAction, validationAtom } from './validation.atom';
import { propsChange } from '../props/props.atom';
import { globalStore, rxGlobalStore } from '../../base/store';
import {
  debounceTime,
  distinctUntilKeyChanged,
  distinctUntilChanged,
} from 'rxjs/operators';
import keys from '@tinkoff/utils/object/keys';

type ValidateFn = (v: string | number) => string | Promise<string>;

class ValidationService {
  constructor({ structure }) {
    this._structure = structure;

    // debug
    // globalStore.subscribe(validationAtom, (vl) => {
    //   console.log('validatonStore', vl);
    // });
  }

  isStepValid() {
    const fieldsByStep = this._structure.map(keys);

    return ({ initiator: { fieldName } }) => {
      rxGlobalStore(validationAtom)
        .pipe(distinctUntilChanged())
        .subscribe((v) => {
          const stepValidationRequirements = fieldsByStep.find((v) =>
            v.includes(fieldName),
          );

          const disabled = stepValidationRequirements.some((x) => v[x]?.length);

          globalStore.dispatch(
            propsChange({
              name: fieldName,
              value: { disabled },
            }),
          );
        });
    };
  }

  validate(validateFns: ValidateFn[]) {
    return ({ initiator: { fieldName } }) => {
      rxGlobalStore(fieldAtom)
        .pipe(distinctUntilKeyChanged(fieldName), debounceTime(300))
        .subscribe(async (nextValue) => {
          const currentValue = nextValue[fieldName];
          if (currentValue === undefined) {
            return;
          }
          const errors = await Promise.all(
            validateFns.map((v) => v(currentValue)),
          ).then((a) => a.filter((x) => !!x));

          globalStore.dispatch(validateAction({ name: fieldName, errors }));
          globalStore.dispatch(
            propsChange({
              name: fieldName,
              value: { error: errors[0] || '' },
            }),
          );
        });
    };
  }
}

export const ValidationFeature = {
  name: 'validation',
  useService: ValidationService,
};

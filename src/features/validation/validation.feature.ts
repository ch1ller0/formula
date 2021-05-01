import { fieldAtom } from '../field/field.atom';
import { validateAction, validationAtom } from './validation.atom';
import { globalStore, rxGlobalStore } from '../../base/store';
import { debounceTime } from 'rxjs/operators';

type ValidationError = { error: string };

class ValidationService {
  private _store: any;

  constructor() {
    this._store = globalStore;
    // debug
    this._store.subscribe(validationAtom, (vl) => {
      console.log('validatonStore', vl);
    });
  }

  validate(validateFn: () => ValidationError | Promise<ValidationError>) {
    return ({ initiator }) => {
      rxGlobalStore(fieldAtom)
        .pipe(debounceTime(300))
        .subscribe((nextValue) => {
          console.log('vlaidrx', nextValue);

          const currentValue = nextValue[initiator];
          const error = validateFn(currentValue);
          this._store.dispatch(validateAction({ name: initiator, error }));
        });
    };
  }
}

export const ValidationFeature = {
  name: 'validation',
  useService: ValidationService,
};

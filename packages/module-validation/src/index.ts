import { declareModule } from '@fridgefm/inverter';
import { validationStateProvider } from './providers/state.provider';
import { validationBindersProvider } from './providers/binders.provider';

export { VALIDATION_BINDERS_TOKEN } from './tokens';
export type { ValidationBinders, ValidationState, ValidateFn } from './types';
export const ValidationModule = declareModule({
  name: 'ValidationModule',
  providers: [validationStateProvider, validationBindersProvider],
});

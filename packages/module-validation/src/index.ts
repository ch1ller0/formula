import { stateProvider } from './providers/state.provider';
import { validationService } from './providers/service.provider';

export { VALIDATION_SERVICE_TOKEN } from './tokens';
export const ValidationModule = [validationService, stateProvider];
export type { ValidationService, ValidationState, ValidateFn } from './types';

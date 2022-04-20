import { createToken } from '@fridgefm/inverter';
import type { ValidationState, ValidationBinders } from './types';

export const VALIDATION_STATE_TOKEN = createToken<ValidationState>('validation:state');
export const VALIDATION_BINDERS_TOKEN = createToken<ValidationBinders>('validation:binders');

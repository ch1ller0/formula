import { createToken } from '@formula/ioc';
import type { ValidationState, ValidationService } from './types';

export const VALIDATION_STATE_TOKEN = createToken<ValidationState>('validation:state');
export const VALIDATION_SERVICE_TOKEN = createToken<ValidationService>('validation:service');

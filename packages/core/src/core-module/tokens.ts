import { createToken } from '@formula/ioc';

export const GLOBAL_STORE_TOKEN = createToken('global-store');
export const STRUCTURE_CONFIG_TOKEN = createToken('structure-config');
export const BINDER_SERVICE_TOKEN = createToken('binder-service');

// core services
export const FIELD_SERVICE_TOKEN = createToken('field-service');
export const PROPS_SERVICE_TOKEN = createToken('props-service');
export const RENDER_SERVICE_TOKEN = createToken('render-service');
export const STEP_SERVICE_TOKEN = createToken('step-service');
export const STRUCTURE_SERVICE_TOKEN = createToken('structure-service');

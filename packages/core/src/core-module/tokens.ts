import { createToken } from '@formula/ioc';

import type { RendererFn } from './render/render.types';
import type { GlobalStore } from './state/state.types';
import type { StructureFactory, StructureService } from './structure/structure.types';
import type { BinderService } from './binder/binder.module';
import type { FieldService } from './field/field.types';
import type { PropsService } from './props/props.types';
import type { StepService } from './step/step.types';

export const GLOBAL_STORE_TOKEN = createToken<GlobalStore>('global-store');
export const STRUCTURE_CONFIG_TOKEN = createToken<StructureFactory>('structure-config');
export const BINDER_SERVICE_TOKEN = createToken<InstanceType<typeof BinderService>>('binder-service');

// core services
export const FIELD_SERVICE_TOKEN = createToken<FieldService>('field-service');
export const PROPS_SERVICE_TOKEN = createToken<PropsService>('props-service');
export const RENDER_SERVICE_TOKEN = createToken<RendererFn>('render-service');
export const STEP_SERVICE_TOKEN = createToken<StepService>('step-service');
export const STRUCTURE_SERVICE_TOKEN = createToken<StructureService>('structure-service');

export const PublicTokens = {
  FIELD_SERVICE_TOKEN,
  PROPS_SERVICE_TOKEN,
  STEP_SERVICE_TOKEN,
  STRUCTURE_SERVICE_TOKEN,
};

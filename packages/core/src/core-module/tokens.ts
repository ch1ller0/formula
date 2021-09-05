import { createToken } from '@formula/ioc';

import type { RendererFn } from './render/render.types';
import type { GlobalStore } from './global-store/global-store.types';
import type { StructureFactory, TStructureService } from './structure/structure.types';
import type { BinderService } from './binder/binder.provider';
import type { TFieldService } from './field/field.types';
import type { TPropsService } from './props/props.types';
import type { StepFactory } from './step/step.types';

export const GLOBAL_STORE_TOKEN = createToken<GlobalStore>('global-store');
export const STRUCTURE_CONFIG_TOKEN = createToken<StructureFactory>('structure-config');
export const BINDER_SERVICE_TOKEN = createToken<InstanceType<typeof BinderService>>('binder-service');

// core services
export const FIELD_SERVICE_TOKEN = createToken<TFieldService>('field-service');
export const PROPS_SERVICE_TOKEN = createToken<TPropsService>('props-service');
export const RENDER_SERVICE_TOKEN = createToken<RendererFn>('render-service');
export const STEP_SERVICE_TOKEN = createToken<StepFactory>('step-service');
export const STRUCTURE_SERVICE_TOKEN = createToken<TStructureService>('structure-service');

import { createToken, declareContainer } from '@fridgefm/inverter';

import type { StructureFactory } from '@formula/core-types';
import type { RendererFn } from './render.types';
import type { GlobalStore, StoreUtils } from './state.types';
import type { StructureService } from './structure.types';
import type { FieldService } from './field.types';
import type { PropsService } from './props.types';
import type { ScreenService, ScreenBinders, ScreenStore } from './screen.types';
import type { BinderService } from './binder.provider';

export const ROOT_CONTAINER_GET_TOKEN = createToken<ReturnType<typeof declareContainer>['get']>(
  'core:root-container-get',
);
export const GLOBAL_STORE_TOKEN = createToken<GlobalStore>('core:store');
export const STORE_UTILS_TOKEN = createToken<StoreUtils>('core:store-util');
export const STRUCTURE_CONFIG_TOKEN = createToken<StructureFactory>('core:structure-config');
export const BINDER_SERVICE_TOKEN = createToken<BinderService>('core:binder');
export const RENDER_SERVICE_TOKEN = createToken<RendererFn>('core:render');

// public core providers
export const FIELD_SERVICE_TOKEN = createToken<FieldService>('core:field');
export const PROPS_SERVICE_TOKEN = createToken<PropsService>('core:props');
export const SCREEN_STORE_TOKEN = createToken<ScreenStore>('core:screen-store');
export const SCREEN_SERVICE_TOKEN = createToken<ScreenService>('core:screen-service');
export const SCREEN_BINDERS_TOKEN = createToken<ScreenBinders>('core:screen-binders');
export const STRUCTURE_SERVICE_TOKEN = createToken<StructureService>('core:structure');

export const PublicTokens = {
  FIELD_SERVICE_TOKEN,
  PROPS_SERVICE_TOKEN,
  SCREEN_SERVICE_TOKEN,
  SCREEN_BINDERS_TOKEN,
  STRUCTURE_SERVICE_TOKEN,
};

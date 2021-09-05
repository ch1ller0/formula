import {
  RENDER_SERVICE_TOKEN,
  STRUCTURE_SERVICE_TOKEN,
  PROPS_SERVICE_TOKEN,
  FIELD_SERVICE_TOKEN,
  STEP_SERVICE_TOKEN,
  GLOBAL_STORE_TOKEN,
} from '../tokens';
import { renderRoot } from './render.util';
import type { RendererFn } from './render.types';
import type { Provider } from '@formula/ioc';

export const renderProvider: Provider<RendererFn> = {
  provide: RENDER_SERVICE_TOKEN,
  useFactory: renderRoot,
  deps: [STRUCTURE_SERVICE_TOKEN, PROPS_SERVICE_TOKEN, FIELD_SERVICE_TOKEN, STEP_SERVICE_TOKEN, GLOBAL_STORE_TOKEN],
};

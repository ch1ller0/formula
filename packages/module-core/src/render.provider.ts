import { injectable } from '@fridgefm/inverter';
import {
  RENDER_SERVICE_TOKEN,
  STRUCTURE_SERVICE_TOKEN,
  PROPS_SERVICE_TOKEN,
  FIELD_SERVICE_TOKEN,
  STEP_SERVICE_TOKEN,
  GLOBAL_STORE_TOKEN,
} from './tokens';
import { renderRoot } from './render.util';

export const renderProviders = [
  injectable({
    provide: RENDER_SERVICE_TOKEN,
    useFactory: renderRoot,
    inject: [
      STRUCTURE_SERVICE_TOKEN,
      PROPS_SERVICE_TOKEN,
      FIELD_SERVICE_TOKEN,
      STEP_SERVICE_TOKEN,
      GLOBAL_STORE_TOKEN,
    ] as const,
  }),
];

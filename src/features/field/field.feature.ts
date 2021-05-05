import { fieldAtom } from './field.atom';
import type { FeatureConfig } from '../features.type';

export const FieldFeature: FeatureConfig<unknown> = {
  name: 'field',
  useState: fieldAtom,
};

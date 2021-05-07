import type { FC } from 'react';
import type { Store } from './base/store';
import type { TFeatureConfig } from './features/features.type';

type TVagueProps = Record<string, any>;
export type TPrimitive = string | number | boolean;

// #### VIEW

// eslint-disable-next-line @typescript-eslint/ban-types
export type TFieldConfig<T extends TVagueProps = TVagueProps> = {
  name: string;
  render: FC<TBuilderFieldProps & T>;
};

export type TFieldStructure = {
  field: TFieldConfig<TVagueProps>;
  props: TVagueProps;
  controls?: (getFeature: any) => unknown[];
};
export type TStepStructure = Record<string, TFieldStructure>;

// #### CONTROL

export type ControlFactory = (store: Store) => (e: Event) => void;
export type Control = {
  name: string;
  fn: ControlFactory;
};

// #### CONFG

export type TBuilderFieldProps = {
  value: string | number;
  name: string;
  setValue: (value: TPrimitive) => void;
};

export type TBuilderConfig = {
  structure: TStepStructure[];
  features: TFeatureConfig[];
};

// @TODO NEED BETTER TYPES, CURRENT ARE REALLY VAGUE

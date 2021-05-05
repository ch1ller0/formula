import type { FC } from 'react';
import type { Store } from './base/store';
import type { Feature } from './features/features.type';

type VagueProps = Record<string, any>;

// #### VIEW

// eslint-disable-next-line @typescript-eslint/ban-types
export type FieldConfig<T extends VagueProps = VagueProps> = {
  name: string;
  render: FC<BuilderFieldProps & T>;
};

export type FieldStructure = {
  field: FieldConfig<VagueProps>;
  props: VagueProps;
};
export type StepStructure = Record<string, FieldStructure>;

// #### CONTROL

export type ControlFactory = (store: Store) => (e: Event) => void;
export type Control = {
  name: string;
  fn: ControlFactory;
};

// #### CONFG

export type BuilderFieldProps = {
  value: string | number;
  name: string;
  setValue: (e: Event) => void;
};

export type BuilderConfig = {
  structure: StepStructure[];
  features: Feature<unknown>[];
};

// @TODO NEED BETTER TYPES, CURRENT ARE REALLY VAGUE

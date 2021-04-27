import type { FC } from 'react';
import type { Store } from './base/atoms/index';

// #### VIEW

// eslint-disable-next-line @typescript-eslint/ban-types
export type FieldConfig<T = {}> = {
  name: string;
  render: FC<BuilderFieldProps & { props: T }>;
};

export type FieldStructure<T = {}> = T extends {
  field: FieldConfig<infer P>;
  props: infer P;
  onAction?: Control;
}
  ? P
  : never;

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
  onAction: (e: Event) => void;
};

export type BuilderConfig = {
  structure: StepStructure[];
};

// @TODO NEED BETTER TYPES, CURRENT ARE REALLY VAGUE

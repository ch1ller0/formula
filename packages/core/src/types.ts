import type { FC } from 'react';
import type { TProviderConfig } from './features/features.type';

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
  controls?: (getProvider: any) => unknown[];
};
export type TStepStructure = Record<string, TFieldStructure>;

// #### CONTROLS

// #### CONFG

export type TBuilderFieldProps = {
  value: TPrimitive;
  name: string;
  setValue: (value: TPrimitive) => void;
};

export type TBuilderConfig = {
  structure: TStepStructure[];
  features: TProviderConfig[];
};

// @TODO NEED BETTER TYPES, CURRENT ARE REALLY VAGUE

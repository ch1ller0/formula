import type { FC } from 'react';
import type { TProviderConfig } from './providers/provider.type';
import { ProviderContainer } from './base/provider-container';

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
  controls?: (
    getProvider: InstanceType<typeof ProviderContainer>['getProvider'],
  ) => unknown[];
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
  providers: TProviderConfig[];
};

// @TODO NEED BETTER TYPES, CURRENT ARE REALLY VAGUE

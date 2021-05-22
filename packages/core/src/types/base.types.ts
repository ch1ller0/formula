import type { FC } from 'react';
import type { TProviderConfig } from './provider.types';
import { ProviderContainer } from '../base/provider-container';

type TVagueProps = Record<string, any>;
export type TPrimitive = string | number | boolean;

// #### VIEW

/**
 * Basic field configuration
 */
export type TFieldConfig<T extends TVagueProps = TVagueProps> = {
  /**
   * Field`s name
   */
  name: string;
  /**
   * React component to render
   */
  render: FC<TBuilderFieldProps & T>;
};

/**
 * Field`s structure that appears in global structure
 */
export type TFieldStructure = {
  /**
   * Field`s unique name - it appears in the stores
   */
  field: TFieldConfig<TVagueProps>;
  /**
   * Initial props of the field that are passed to React Component
   */
  props: TVagueProps;
  /**
   * Controls to manipulate behaviour on the field
   */
  controls?: (
    getProvider: InstanceType<typeof ProviderContainer>['getProvider'],
  ) => unknown[];
};
export type TStepStructure = Record<string, TFieldStructure>;

// #### CONFG

/**
 * Props that are passed to a field in form run-time
 */
export type TBuilderFieldProps = {
  /**
   * Name passed to a component
   */
  name: string;
  /**
   * Current field`s value
   */
  value: TPrimitive;
  /**
   * Callback for setting the value
   */
  setValue: (value: TPrimitive) => void;
};

/**
 * Global form configuration
 */
export type TBuilderConfig = {
  /**
   * Initial form structure (it might change in run-time)
   */
  structure: TStepStructure[];
  /**
   * Registered providers
   */
  providers: TProviderConfig[];
};

// @TODO NEED BETTER TYPES, CURRENT ARE REALLY VAGUE

import type { FC } from 'react';
import type {
  TProviderConfig,
  BinderFactory,
  TProviderService,
} from './provider.types';
import { ProviderContainer } from '../base/provider-container';

type TVagueProps = Record<string, any>;
export type TPrimitive = string | number | boolean | null;

// #### VIEW

/**
 * Basic field configuration
 */
export type TFieldConfig<
  Prps extends TVagueProps = TVagueProps,
  FT extends TPrimitive = TPrimitive
> = {
  /**
   * Field`s name
   */
  name: string;
  /**
   * React component to render
   */
  render: FC<TBuilderFieldProps<FT> & Prps>;
  /**
   * The method to get initial value or a primitive
   */
  initialValue: FT | ((props: Prps) => FT);
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
  controls?: (arg: {
    getService: InstanceType<typeof ProviderContainer>['getService'];
    getBinders: (
      s: TProviderConfig<TProviderService>,
    ) => Record<string, BinderFactory> | undefined;
  }) => unknown[];
};
export type TStepStructure = Record<string, TFieldStructure>;

// #### CONFG

/**
 * Props that are passed to a field in form run-time
 */
export type TBuilderFieldProps<T extends TPrimitive = TPrimitive> = {
  /**
   * Name passed to a component
   */
  name: string;
  /**
   * Current field`s value
   */
  value: T;
  /**
   * Callback for setting the value
   */
  setValue: (value: T) => void;
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

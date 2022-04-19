import type { declareContainer } from '@fridgefm/inverter';
import type { FC } from 'react';
import type { TodoAny } from '@formula/core-types';

export type ContainerGet = ReturnType<typeof declareContainer>['get'];

type TVagueProps = Record<string, TodoAny>;

export type Primitive = string | number | boolean | null;

/**
 * Basic field configuration
 */
export type FieldConfig<Prps extends TVagueProps = TVagueProps, FT extends Primitive = Primitive> = {
  /**
   * Field`s name
   */
  name: string;
  /**
   * React component to render
   */
  render: FC<BuilderFieldProps<FT> & Prps>;
  /**
   * The method to get initial value or a primitive
   */
  initialValue: (props: Prps) => FT;
};

export type BinderReturn = (fieldName: string) => void;

/**
 * Field`s structure that appears in global structure
 */
export type TFieldStructure = {
  /**
   * Field`s unique name - it appears in the stores
   */
  field: FieldConfig<TVagueProps>;
  /**
   * Initial props of the field that are passed to React Component
   */
  props: TVagueProps;
  /**
   * Controls to manipulate behaviour on the field
   */
  controls?: (get: ContainerGet) => BinderReturn[];
};
export type TStepStructure = Record<string, TFieldStructure>;

// #### CONFG

/**
 * Props that are passed to a field in form run-time
 */
export type BuilderFieldProps<T extends Primitive = Primitive> = {
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

// @TODO NEED BETTER TYPES, CURRENT ARE REALLY VAGUE

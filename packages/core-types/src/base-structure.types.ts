import type { declareContainer } from '@fridgefm/inverter';
import type { TVagueProps, Primitive } from './base-props.types';
import type { FC } from 'react';

export type ScreenName = string;
export type StructureInput = GroupOut | ArrayOut | TFieldStructure;
export type FormStructure = Record<ScreenName, GroupOut>;

export type GroupOpts = {
  horizontal?: true;
  invisible?: boolean;
};

export type GroupOut = {
  type: 'group';
  group: Record<string, StructureInput>;
  opts: GroupOpts;
};

export type ArrayOpts = {
  count: number;
};

export type ArrayOut = {
  type: 'array';
  array: Record<string, TFieldStructure>[];
  opts: ArrayOpts;
  generator: (i: number) => Record<string, TFieldStructure>;
};

export type ContainerGet = ReturnType<typeof declareContainer>['get'];

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

export type TScreenStructure = Record<string, TFieldStructure>;

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

export type StructureFactory = (args: {
  group(cfg: Record<string, StructureInput>, opts?: GroupOpts): GroupOut;
  array(gen: ArrayOut['generator'], opts?: ArrayOpts): ArrayOut;
}) => FormStructure;

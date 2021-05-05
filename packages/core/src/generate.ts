import type { FieldConfig, StepStructure } from './types';

type Brand<T> = { _: T };

export class ViewGenerator {
  static field<Props extends Record<string, unknown>>(
    fieldCfg: FieldConfig<Props>,
  ): FieldConfig<Props> & Brand<'field'> {
    return {
      name: fieldCfg.name,
      render: fieldCfg.render,
    } as FieldConfig<Props> & Brand<'field'>;
  }

  static step(stepCfg: StepStructure): StepStructure & Brand<'step'> {
    return stepCfg as StepStructure & Brand<'step'>;
  }
}
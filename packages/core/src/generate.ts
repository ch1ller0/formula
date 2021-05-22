import type { TFieldConfig, TStepStructure } from './types/base.types';

type Brand<T> = { _: T };

export class ViewGenerator {
  static field<Props extends Record<string, unknown>>(
    fieldCfg: TFieldConfig<Props>,
  ): TFieldConfig<Props> & Brand<'field'> {
    return {
      name: fieldCfg.name,
      render: fieldCfg.render,
      initialValue: fieldCfg.initialValue,
    } as TFieldConfig<Props> & Brand<'field'>;
  }

  static step(stepCfg: TStepStructure): TStepStructure & Brand<'step'> {
    return stepCfg as TStepStructure & Brand<'step'>;
  }
}

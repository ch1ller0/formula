import type { FieldConfig } from './types/base.types';

type Brand<T> = { _: T };

export class ViewGenerator {
  static field<Props extends Record<string, unknown>>(
    fieldCfg: FieldConfig<Props>,
  ): FieldConfig<Props> & Brand<'field'> {
    return {
      name: fieldCfg.name,
      render: fieldCfg.render,
      initialValue: fieldCfg.initialValue,
    } as FieldConfig<Props> & Brand<'field'>;
  }
}

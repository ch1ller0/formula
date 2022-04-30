import type { FieldConfig } from '@formula/core-types';

type Brand<T> = { _: T };

const field = <Props extends Record<string, unknown>>(
  fieldCfg: FieldConfig<Props>,
): FieldConfig<Props> & Brand<'field'> =>
  ({
    name: fieldCfg.name,
    render: fieldCfg.render,
    initialValue: fieldCfg.initialValue,
  } as FieldConfig<Props> & Brand<'field'>);

// const group = (a, opts) => ({
//   type: 'group',
//   group: a,
//   opts: opts || {},
// });

// const array = (generator, opts) => ({
//   type: 'array',
//   array: range(opts?.count || 2).map(generator),
//   opts: opts || { count: 2 },
// });

export const ViewGenerator = { field };

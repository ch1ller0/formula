import type { TodoAny } from '@formula/core-types';

export type Token<T = unknown> = symbol & { description: string } & { _brand: T };
export type ExtractToken<T extends Token> = T['_brand'];

export type Provider<P = unknown> = {
  provide: Token<P>;
  deps?: Token<TodoAny>[];
  useValue?: P;
  useFactory?: (deps: TodoAny) => P;
  useClass?: new (deps: TodoAny) => P;
};

export type IocRecord<R = unknown> = {
  provider: Provider;
  /**
   * 0 - resolved\
   * 1 - processing\
   * 2 - unresolved
   */
  marker: 0 | 1 | 2;
  resolved?: R;
};

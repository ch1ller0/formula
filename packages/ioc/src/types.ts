export type Token<T = unknown> = symbol & { description: string } & { _brand: T };
export type ExtractToken<T extends Token> = T['_brand'];

export type Provider<P = unknown> = {
  provide: Token<P>;
  deps?: Token<any>[];
  useValue?: P;
  useFactory?: (deps: any) => P;
  useClass?: new (deps: any) => P;
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

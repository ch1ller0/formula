export type Token = symbol | string;

type ProviderBase = {
  provide: Token;
  deps?: Token[];
};

export type Provider = ProviderBase & {
  useValue?: any;
  useFactory?: (deps: any) => unknown;
  useClass?: any;
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

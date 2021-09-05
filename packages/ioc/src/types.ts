type ProviderBase = {
  provide: string;
  deps?: ProviderBase['provide'][];
};

export type Provider = ProviderBase & {
  useValue?: any;
  useFactory?: (deps: any) => unknown;
  useClass?: any;
};

type ProviderBase = {
  provide: string;
  deps?: ProviderBase['provide'][];
};

export type Provider = ProviderBase & {
  useValue?: string;
  useFactory?: (deps: any) => unknown;
  useClass?: any;
};

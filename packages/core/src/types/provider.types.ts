import type { Store } from '@reatom/core';
import type { Observable } from 'rxjs';
import type { TStepStructure } from './base.types';

export type TProviderConsturctorArgs = {
  /**
   * Services from other providers current provider depends on
   */
  deps: unknown[];
  /**
   * Global form-store
   */
  globalStore: Store;
  /**
   * Structure configration
   */
  structure: TStepStructure[];
};

export interface TProviderService {
  /**
   * Method for getting an Observable from Provider`s store
   */
  getRxStore?(): Observable<any>;
}

export type TProviderConfig<Srv = TProviderService> = {
  /**
   * Name of the provider
   */
  name: string;
  /**
   * Service the provider should expose to other parts of the program
   */
  useService: {
    new (args: TProviderConsturctorArgs): Srv;
  };
  /**
   * Providers the current provider depends on
   */
  deps?: TProviderConfig[];
};

export type TToProviderInstance<Config extends TProviderConfig> = InstanceType<
  Config['useService']
>;

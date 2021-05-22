import type { Store } from '@reatom/core';
import type { Observable } from 'rxjs';
import type { TStepStructure } from '../types';

export type TProviderConsturctorArgs = {
  deps: unknown[];
  globalStore: Store;
  structure: TStepStructure[];
};

export interface TProviderService {
  getRxStore?(): Observable<any>;
}

export type TProviderConfig<Srv = TProviderService> = {
  name: string;
  useService: {
    new (args: TProviderConsturctorArgs): Srv;
  };
  deps?: TProviderConfig[];
};

export type TToProviderInstance<Config extends TProviderConfig> = InstanceType<
  Config['useService']
>;

/**
 * A feature is a reusable singletone of a logic that might contain
 * 1 A service that might be used by other features
 * 2 An atom used only by itself
 */

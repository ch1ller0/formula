import type { Store, Atom, ActionCreator } from '@reatom/core';
import type { Observable } from 'rxjs';
import type { TStepStructure } from '../types';

export type TFeatureConstructorArgs = {
  deps: unknown[];
  globalStore: Store;
  structure: TStepStructure[];
};

export interface TProviderService {
  getRxStore?(): Observable<any>;
}

export type TProviderConfig<Service = TProviderService> = {
  name: string;
  useService: {
    new (args: TFeatureConstructorArgs): Service;
  };
  deps?: TProviderConfig[];
};

/**
 * A feature is a reusable singletone of a logic that might contain
 * 1 A service that might be used by other features
 * 2 An atom used only by itself
 */

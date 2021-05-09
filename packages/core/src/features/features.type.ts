import type { Store, Atom, ActionCreator } from '@reatom/core';
import type { Observable } from 'rxjs';
import type { TStepStructure } from '../types';

export type TFeatureConstructorArgs = {
  deps: unknown[];
  globalStore: Store;
  structure: TStepStructure[];
};

export interface TFeatureService {
  getRxStore?(): Observable<any>;
  getAtom?(): Atom<any>;
  getActions?(): Record<string, ActionCreator<string>>;
}

export type TFeatureConfig = {
  name: string;
  useService: {
    new (args: TFeatureConstructorArgs): TFeatureService;
  };
  deps?: TFeatureConfig[];
};

/**
 * A feature is a reusable singletone of a logic that might contain
 * 1 A service that might be used by other features
 * 2 An atom used only by itself
 */

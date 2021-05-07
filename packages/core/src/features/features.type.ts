import type { Store, Atom, ActionCreator } from '@reatom/core';
import type { Observable } from '@reatom/observable';
import type { StepStructure } from '../types';

export type FeatureConstructorArgs = {
  deps: FeatureProvider[];
  globalStore: Store;
  structure: StepStructure[];
};

export type FeatureService = {
  new (a: FeatureConstructorArgs): FeatureProvider;
  getRxStore?(): Observable<any>;
  getAtom?(): Atom<any>;
  getActions?(): Record<string, ActionCreator<string>>;
};

export type FeatureConfig = {
  name: string;
  useService?: FeatureService;
  deps?: FeatureConfig[];
};

export type FeatureProvider = {
  service: unknown;
};

/**
 * A feature is a reusable singletone of a logic that might contain
 * 1 A service that might be used by other features
 * 2 An atom used only by itself
 */

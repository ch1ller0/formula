import toPairs from '@tinkoff/utils/object/toPairs';
import { createGlobalStore, toRxStore } from '../store';

import type { TStepStructure } from '../../types';
import type {
  TFeatureConfig,
  TFeatureService,
} from '../../features/features.type';

const getName = (name: string) => `feature:${name}`;

type Config = {
  structure: TStepStructure[];
  features: TFeatureConfig[];
};

export class FeatureRegistry {
  private _cfg: Config | undefined;
  private _featureProviders = Object.create(null) as Record<
    string,
    TFeatureService
  >;
  private _globalStore = createGlobalStore();

  constructor() {
    toRxStore(this._globalStore).subscribe((v) => {
      console.log('rxGlobalStore', v);
    });
  }

  getStore() {
    return this._globalStore;
  }

  getArguments() {
    return this._cfg;
  }

  getFeature(cfg: TFeatureConfig) {
    return this._featureProviders[getName(cfg.name)];
  }

  fill(_cfg: Config) {
    this._cfg = _cfg;
    const { structure, features } = _cfg;
    const constructService = (cfg: TFeatureConfig): TFeatureService => {
      const alreadyRegisteredDep = this.getFeature(cfg);
      if (alreadyRegisteredDep !== undefined) {
        return alreadyRegisteredDep;
      }

      const resolvedDeps = cfg.deps?.map(constructService) || [];

      return new cfg.useService({
        structure,
        deps: resolvedDeps,
        globalStore: this.getStore(),
      });
    };

    features.forEach((cfg) => {
      const key = getName(cfg.name);
      this._featureProviders[key] = constructService(cfg);
    });

    structure.forEach((step) => {
      toPairs(step).forEach(([fieldName, { controls }]) => {
        if (controls) {
          const fieldControls = controls(this.getFeature.bind(this));
          fieldControls.forEach((element) => {
            element({ initiator: { fieldName } });
          });
        }
      });
    });
  }
}

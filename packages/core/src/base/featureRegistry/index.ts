import toPairs from '@tinkoff/utils/object/toPairs';
import { globalStore } from '../store';
import { StepStructure } from '../../types';
import { FeatureConfig, FeatureProvider } from '../../features/features.type';

const getName = (name: string) => `feature:${name}`;

type Config = {
  structure: StepStructure[];
  features: FeatureConfig[];
};

export class FeatureRegistry {
  private _cfg: Config;
  private _featureProviders: Record<string, FeatureProvider>;

  constructor() {
    this._featureProviders = Object.create(null);
  }

  getStore() {
    return globalStore;
  }

  getArguments() {
    return this._cfg;
  }

  getFeature(cfg: FeatureConfig) {
    return this._featureProviders[getName(cfg.name)];
  }

  fill(_cfg: Config) {
    this._cfg = _cfg;
    const { structure, features } = _cfg;
    const constructService = (cfg: FeatureConfig): FeatureProvider | null => {
      const alreadyRegisteredDep = this.getFeature(cfg);
      if (alreadyRegisteredDep !== undefined) {
        return alreadyRegisteredDep;
      }

      const resolvedDeps = cfg.deps?.map(constructService) || [];

      return cfg.useService
        ? new cfg.useService({
            structure,
            deps: resolvedDeps,
            globalStore: this.getStore(),
          })
        : null;
    };

    features.forEach((cfg) => {
      const key = getName(cfg.name);
      this._featureProviders[key] = constructService(cfg, { structure });
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

import toPairs from '@tinkoff/utils/object/toPairs';
import { globalStore, rxGlobalStore } from '../store';
import { StepStructure } from '../../types';
import { FeatureConfig, FeatureProvider } from '../../features/features.type';

const getName = (name: string) => `feature:${name}`;

type Deps = {
  structure: StepStructure[];
  features: FeatureConfig<unknown>[];
};

export class FeatureRegistry {
  private _featureProviders: Record<string, FeatureProvider>;

  constructor() {
    this._featureProviders = Object.create(null);
  }

  getStore() {
    return globalStore;
  }

  getFeature(cfg: FeatureConfig<unknown>) {
    return this._featureProviders[getName(cfg.name)];
  }

  fill({ structure, features }: Deps) {
    const constructService = (cfg: FeatureConfig<unknown>) => {
      const alreadyRegisteredDep = this.getFeature(cfg);
      if (alreadyRegisteredDep) {
        return alreadyRegisteredDep;
      }

      return {
        service: cfg.useService
          ? new cfg.useService({
              structure,
              deps: cfg.deps?.map(constructService),
            })
          : undefined,
        // getRxStore: () => rxGlobalStore(cfg)
      };
    };
    // console.log('getdependencyGraph', getDependencyGraph({ features }));

    features.forEach((cfg) => {
      // @TODO add dependency graph
      const key = getName(cfg.name);
      //   const getService = (feature: FeatureConfig) => {
      //     const name = getName(feature.name);
      //     return this._featureProviders[name].service;
      //   };

      this._featureProviders[key] = constructService(cfg, { structure });
    });

    structure.forEach((step) => {
      toPairs(step).forEach(([fieldName, { controls }]) => {
        if (controls) {
          const getService = (config: FeatureConfig) => {
            const realisation = this._featureProviders[getName(config.name)];
            if (!realisation) {
              throw new Error(
                `Did not find "${config.name}" feature in a registry. Forgot to call "addFeatures"? `,
              );
            }
            return realisation.service;
          };

          const fieldControls = controls(getService);
          fieldControls.forEach((element) => {
            element({ initiator: { fieldName } });
          });
        }
      });
    });
  }
}

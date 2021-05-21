import toPairs from '@tinkoff/utils/object/toPairs';
import { createGlobalStore, toRxStore } from '../store';

import type { TStepStructure } from '../../types';
import type {
  TProviderConfig,
  TProviderService,
} from '../../features/features.type';

const getName = (name: string) => `feature:${name}`;

type Config = {
  structure: TStepStructure[];
  features: TProviderService[];
};

export class ProviderContainer {
  private _cfg: Config;
  private _featureProviders = Object.create(null) as Record<
    string,
    TProviderConfig
  >;
  private _globalStore = createGlobalStore();

  constructor({ cfg }) {
    this._cfg = cfg;
    // toRxStore(this._globalStore).subscribe((v) => {
    //   console.log('rxGlobalStore', v);
    // });
  }

  getStore() {
    return this._globalStore;
  }

  getConfig() {
    return this._cfg;
  }

  getProvider<Pr extends TProviderConfig>({
    name,
  }: Pr): InstanceType<Pr['useService']> {
    return this._featureProviders[getName(name)];
  }

  fill() {
    const { structure, features } = this._cfg;
    const constructService = (cfg: TProviderConfig): TProviderService => {
      const alreadyRegisteredDep = this.getProvider(cfg);
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
          const fieldControls = controls(this.getProvider.bind(this));
          fieldControls.forEach((element) => {
            element({ initiator: { fieldName } });
          });
        }
      });
    });
  }
}

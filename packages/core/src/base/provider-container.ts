import toPairs from '@tinkoff/utils/object/toPairs';
import noop from '@tinkoff/utils/function/noop';
import { createGlobalStore, toRxStore } from './store';

import type { TBuilderConfig } from '../types';
import type {
  TProviderConfig,
  TProviderService,
} from '../features/features.type';

const getName = (name: string) => `feature:${name}`;

export class ProviderContainer {
  private _cfg: TBuilderConfig;
  private _featureProviders = Object.create(null) as Record<
    string,
    TProviderConfig
  >;
  private _globalStore = createGlobalStore();

  constructor({ cfg }: { cfg: TBuilderConfig }) {
    this._cfg = cfg;
    // @ts-ignore
    this._globalStore.subscribe(noop);
    window.__formulaStore = this._globalStore;
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

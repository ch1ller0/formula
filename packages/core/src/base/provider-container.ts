import toPairs from '@tinkoff/utils/object/toPairs';
import { createGlobalStore } from './store';

import type { TBuilderConfig } from '../types/base.types';
import type {
  BinderFactory,
  TProviderConfig,
  TProviderService,
  TToProviderInstance,
} from '../types/provider.types';

const getName = (name: string) => `provider:${name}`;

export class ProviderContainer {
  private _cfg: TBuilderConfig;
  private _providers = Object.create(null) as Record<
    string,
    TToProviderInstance<TProviderConfig>
  >;
  private _globalStore = createGlobalStore();

  constructor({ cfg }: { cfg: TBuilderConfig }) {
    this._cfg = cfg;
    if (process.env.NODE_ENV === 'development' && typeof window !== undefined) {
      // @ts-ignore
      window.__formula = {
        store: this._globalStore,
        providers: this._providers,
        config: this._cfg,
      };
    }
  }

  getStore() {
    return this._globalStore;
  }

  getConfig() {
    return this._cfg;
  }

  getService<Pr extends TProviderConfig>({
    name,
  }: Pr): TToProviderInstance<Pr> {
    return this._providers[getName(name)];
  }

  getBinders<Pr extends TProviderConfig>({
    name,
  }: Pr): ReturnType<TToProviderInstance<Pr>['useBinders']> {
    return this._providers[getName(name)].useBinders?.();
  }

  fill() {
    const { structure, providers } = this._cfg;
    const constructService = (cfg: TProviderConfig): TProviderService => {
      const alreadyRegisteredDep = this.getService(cfg);
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

    providers.forEach((cfg) => {
      const key = getName(cfg.name);
      this._providers[key] = constructService(cfg);
    });

    structure.forEach((step) => {
      toPairs(step).forEach(([fieldName, { controls }]) => {
        if (controls) {
          const fieldControls = controls({
            getBinders: this.getBinders.bind(this),
            getService: this.getService.bind(this),
          });
          fieldControls.forEach((element) => {
            element(fieldName);
          });
        }
      });
    });
  }
}

import toPairs from '@tinkoff/utils/object/toPairs';
import { createGlobalStore } from './store';

import type { TBuilderConfig } from '../types/base.types';
import type {
  TProviderConfig,
  TProviderService,
  TToProviderInstance,
} from '../types/provider.types';
import { StructureProvider } from '../core-providers';

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

  _getStore() {
    return this._globalStore;
  }

  getService<Pr extends TProviderConfig>({
    name,
  }: Pr): TToProviderInstance<Pr> {
    // @ts-ignore
    return this._providers[getName(name)];
  }

  getBinders<Pr extends TProviderConfig>({
    name,
  }: // @ts-ignore
  Pr): ReturnType<TToProviderInstance<Pr>['useBinders']> {
    // @ts-ignore
    return this._providers[getName(name)].useBinders?.();
  }

  public registerSingleProvider = (
    cfg: TProviderConfig,
    additionalDeps?: unknown,
  ): TProviderService => {
    const alreadyRegisteredDep = this.getService(cfg);

    if (alreadyRegisteredDep !== undefined) {
      return alreadyRegisteredDep;
    }

    const resolvedDeps = cfg.deps?.map(this.registerSingleProvider) || [];

    const service = new cfg.useService(
      {
        deps: resolvedDeps,
        globalStore: this._getStore(),
      },
      additionalDeps,
    );

    this._providers[getName(cfg.name)] = service;

    return service;
  };

  registerProviders() {
    const { providers } = this._cfg;

    providers.forEach(this.registerSingleProvider);
  }

  bindControls() {
    const structure = this.getService(StructureProvider)._getInitialState();

    toPairs(structure).map(([fieldName, { controls }]) => {
      if (controls) {
        controls({
          getBinders: this.getBinders.bind(this),
          getService: this.getService.bind(this),
        }).forEach((element) => element(fieldName));
      }
    });
  }
}

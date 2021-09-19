import React from 'react';
import { DependencyContainer } from '@formula/ioc';
import { CoreModule } from './core-module';
import {
  STRUCTURE_CONFIG_TOKEN,
  RENDER_SERVICE_TOKEN,
  GLOBAL_STORE_TOKEN,
  BINDER_SERVICE_TOKEN,
} from './core-module/tokens';
import type { Provider } from '@formula/ioc';
import type { StructureFactory } from './core-module/structure/structure.types';

export class FormBuilder {
  private _config: { providers: Provider[] };

  constructor() {
    this._config = { providers: CoreModule };
  }

  addProviders(ar: Provider[]) {
    this._config.providers = this._config.providers.concat(ar);
    return this;
  }

  buildStructure(factory: StructureFactory) {
    this.addProviders([
      {
        provide: STRUCTURE_CONFIG_TOKEN,
        useValue: factory,
      },
    ]);

    return this;
  }

  toComponent(CoreWrapper?: React.FC): React.ReactNode {
    const depContainer = new DependencyContainer(this._config.providers);
    // initialize bindings for fields
    depContainer.getByToken(BINDER_SERVICE_TOKEN).initialize();
    // @TODO create logger provider
    // eslint-disable-next-line no-console
    console.log('before-render-state:', depContainer.getByToken(GLOBAL_STORE_TOKEN).getState());
    const renderer = depContainer.getByToken(RENDER_SERVICE_TOKEN);

    return renderer(CoreWrapper);
  }

  // this is a very costly operation, use it only in dev mode
  _getDebugProviders() {
    return new DependencyContainer(this._config.providers)._getResolvedNodes();
  }
}

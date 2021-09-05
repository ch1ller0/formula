import React from 'react';
import { coreProviders } from './core-module';
import { DependencyContainer } from '@formula/ioc';
import {
  STRUCTURE_CONFIG_TOKEN,
  RENDER_SERVICE_TOKEN,
  GLOBAL_STORE_TOKEN,
  BINDER_SERVICE_TOKEN,
} from './core-module/tokens';

import type { StructureFactory } from './core-module/structure/structure.types';
import type { Provider } from '@formula/ioc';
import type { RendererFn } from './core-module/render/render.types';

export class FormBuilder {
  private _config: { providers: Provider[] };

  constructor() {
    this._config = { providers: coreProviders };
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
    console.log(
      'before-render-state:',
      depContainer.getByToken(GLOBAL_STORE_TOKEN).getState(),
    );
    const renderer: RendererFn = depContainer.getByToken(RENDER_SERVICE_TOKEN);

    return renderer(CoreWrapper);
  }
}

import React from 'react';
import { coreProviders } from '../core-module';
import { DependencyContainer } from '@formula/ioc';
import {
  STRUCTURE_CONFIG_TOKEN,
  RENDER_SERVICE_TOKEN,
  GLOBAL_STORE_TOKEN,
} from '../core-module/tokens';

import type { StructureFactory } from '../core-module/structure/structure.types';

import type { Provider } from '@formula/ioc';

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
    // const globalStoreState =
    console.log(
      'before-render-state:',
      depContainer.getByToken(GLOBAL_STORE_TOKEN).getState(),
    );
    const renderer = depContainer.getByToken(RENDER_SERVICE_TOKEN);

    return renderer(CoreWrapper);
  }
}

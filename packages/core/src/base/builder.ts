import React from 'react';
import { ProviderContainer } from './provider-container';
import {
  StructureProvider,
  RenderProvider,
  PropsProvider,
  StepProvider,
  FieldProvider,
} from '../core-providers/index';

import type { StructureFactory } from '../core-providers/structure/structure.types';
import type { TProviderConfig } from '../types/provider.types';
import type { TBuilderConfig } from '../types/base.types';

// pack of providers required for form to work
const DEFAULT_PROVIDERS = [
  StructureProvider,
  RenderProvider,
  PropsProvider,
  StepProvider,
  FieldProvider,
];

export class FormBuilder {
  private _config: TBuilderConfig;
  private _providerContainer: ProviderContainer;

  constructor() {
    this._config = { providers: DEFAULT_PROVIDERS };
    this._providerContainer = new ProviderContainer({ cfg: this._config });
  }

  addProviders(ar: TProviderConfig[]) {
    this._config.providers = this._config.providers.concat(ar);
    return this;
  }

  buildStructure(factory: StructureFactory) {
    this._providerContainer.registerSingleProvider(StructureProvider, {
      factory,
    });

    return this;
  }

  toComponent(CoreWrapper?: React.FC): React.ReactNode {
    this._initInternalDeps();

    console.log(
      'before-render-state:',
      this._providerContainer._getStore().getState(),
    );

    return this._providerContainer
      .getService(RenderProvider)
      .renderRoot(CoreWrapper);
  }

  private _initInternalDeps() {
    this._providerContainer.registerProviders();
    this._providerContainer.bindControls();
  }
}

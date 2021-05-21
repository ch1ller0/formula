import React from 'react';
import { ProviderContainer } from './provider-container.ts';
import { renderComponent } from './render';

import type { TProviderConfig } from '../features/features.type';
import type { TBuilderConfig, TFieldStructure } from '../types';

export class FormBuilder {
  private _config: TBuilderConfig;
  private _providerContainer: ProviderContainer | undefined;
  private _initInternalDeps() {
    this._providerContainer = new ProviderContainer({ cfg: this._config });
    this._providerContainer.fill();
  }

  constructor() {
    this._config = { structure: [], features: [] };
  }

  addStep(stepStructure: Record<string, TFieldStructure>) {
    const nextStepIndex = this._config.structure.length;
    this._config.structure[nextStepIndex] = stepStructure;

    return this;
  }

  addFeatures(ar: TProviderConfig[]) {
    this._config.features = this._config.features.concat(ar);
    return this;
  }

  toComponent(CoreWrapper?: React.FC): React.ReactNode {
    this._initInternalDeps();

    if (!this._providerContainer) {
      throw new Error('No provider container registered');
    }

    return renderComponent(this._providerContainer, CoreWrapper);
  }
}

import React from 'react';
import { ProviderContainer } from './provider-container';
import { renderComponent } from './render';
import {
  PropsProvider,
  StepProvider,
  FieldProvider,
} from '../providers/built-in';

import type { TProviderConfig } from '../types/provider.types';
import type { TBuilderConfig, TFieldStructure } from '../types/base.types';

// pack of providers required for form to work
const DEFAULT_PROVIDERS = [PropsProvider, StepProvider, FieldProvider];

export class FormBuilder {
  private _config: TBuilderConfig;
  private _providerContainer: ProviderContainer | undefined;
  private _initInternalDeps() {
    this._providerContainer = new ProviderContainer({ cfg: this._config });
    this._providerContainer.fill();
  }

  constructor() {
    this._config = { structure: [], providers: DEFAULT_PROVIDERS };
  }

  addStep(stepStructure: Record<string, TFieldStructure>) {
    const nextStepIndex = this._config.structure.length;
    this._config.structure[nextStepIndex] = stepStructure;

    return this;
  }

  addProviders(ar: TProviderConfig[]) {
    this._config.providers = this._config.providers.concat(ar);
    return this;
  }

  toComponent(CoreWrapper?: React.FC): React.ReactNode {
    this._initInternalDeps();

    if (!this._providerContainer) {
      throw new Error('No provider container registered');
    }

    console.log(
      'before-render-state:',
      this._providerContainer.getStore().getState(),
    );

    return renderComponent(this._providerContainer, CoreWrapper);
  }
}

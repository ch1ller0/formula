// https://excalidraw.com/#json=5759839904989184,jPg3ft3xFFj3Xu4IA3hCBQ
/**
 * Milestones
 * 1 Создать базовый плагин AddApplication
 * 2 Создать еще какой нибудь плагин
 */

import React from 'react';
import { FeatureRegistry } from './featureRegistry';
import { renderComponent } from './render';

import type { FeatureConfig } from '../features/features.type';
import type { BuilderConfig, FieldStructure } from '../types';

export class FormBuilder {
  private _config: BuilderConfig;
  private _registry: FeatureRegistry;
  private _initInternalDeps() {
    this._registry.fill(this._config);
  }

  constructor() {
    this._config = { structure: [], features: [] };
    this._registry = new FeatureRegistry();
  }

  addStep(stepStructure: Record<string, FieldStructure>) {
    const nextStepIndex = this._config.structure.length;
    this._config.structure[nextStepIndex] = stepStructure;

    return this;
  }

  addFeatures(ar: FeatureConfig[]) {
    this._config.features = this._config.features.concat(ar);
    return this;
  }

  toComponent(CoreWrapper?: React.FC): React.ReactNode {
    this._initInternalDeps();

    return renderComponent(this._registry, CoreWrapper);
  }
}

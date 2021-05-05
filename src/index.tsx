// https://excalidraw.com/#json=5759839904989184,jPg3ft3xFFj3Xu4IA3hCBQ
/**
 * Milestones
 * 1 Добавить валидацию полей
 * 2 Создать базовый плагин AddApplication
 * 3 Создать еще какой нибудь плагин
 */

import React from 'react';
import { context } from '@reatom/react';
import { FeatureRegistry } from './base/featureRegistry';
import { FeatureConfig } from './features/features.type';

import { StepWrapper } from './features/step/step.gen';

import type { BuilderConfig, FieldStructure } from './types';
import { StepFeature } from './features/step/step.feature';

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

  addFeatures(ar: FeatureConfig<unknown>[]) {
    this._config.features = this._config.features.concat(ar);
    return this;
  }

  toComponent(CoreWrapper: React.FC): React.ReactNode {
    this._initInternalDeps();
    const store = this._registry.getStore();

    return () => (
      <context.Provider value={store}>
        <CoreWrapper>
          <StepWrapper
            provider={this._registry.getFeature(StepFeature)}
            structure={this._config.structure}
          />
        </CoreWrapper>
      </context.Provider>
    );
  }
}

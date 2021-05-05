// https://excalidraw.com/#json=5759839904989184,jPg3ft3xFFj3Xu4IA3hCBQ
/**
 * Milestones
 * 1 Добавить валидацию полей
 * 2 Создать базовый плагин AddApplication
 * 3 Создать еще какой нибудь плагин
 */

import React from 'react';
import { context } from '@reatom/react';
import { globalStore } from './base/store';
import { FeatureRegistry } from './base/featureRegistry';
import { Feature } from './features/features.type';

import { StepWrapper } from './features/step/step.gen';

import type { BuilderConfig, FieldStructure } from './types';

export class FormBuilder {
  private _config: BuilderConfig;
  private _registry: FeatureRegistry;

  constructor() {
    this._config = { structure: [], features: [] };
    this._registry = new FeatureRegistry();
  }

  addStep(stepStructure: Record<string, FieldStructure>) {
    const nextStepIndex = this._config.structure.length;
    this._config.structure[nextStepIndex] = stepStructure;

    return this;
  }

  addFeatures(ar: Feature<unknown>[]) {
    this._config.features = this._config.features.concat(ar);
    return this;
  }

  toComponent(Wrapper: React.FC): React.ReactNode {
    this._registry.fill(this._config);

    return () => (
      <context.Provider value={globalStore}>
        <Wrapper>
          <StepWrapper structure={this._config.structure} store={globalStore} />
        </Wrapper>
      </context.Provider>
    );
  }
}

export const formBuilder = new FormBuilder();

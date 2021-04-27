// https://excalidraw.com/#json=5759839904989184,jPg3ft3xFFj3Xu4IA3hCBQ
/**
 * Milestones
 * 1 Добавить валидацию полей
 * 2 Создать базовый плагин AddApplication
 * 3 Создать еще какой нибудь плагин
 */

import React from 'react';
import { context } from '@reatom/react';
import { combinedStore } from './base/atoms/index';
import { StepWrapper } from './base/step-gen';

import type { BuilderConfig, FieldStructure } from './types';

export class FormBuilder {
  private _config: BuilderConfig;
  private _store: typeof combinedStore;

  constructor() {
    this._config = { structure: [] };
    this._store = combinedStore;
  }

  addStep(stepStructure: Record<string, FieldStructure>) {
    const nextStepIndex = this._config.structure.length;
    this._config.structure[nextStepIndex] = stepStructure;
    return this;
  }

  toComponent(Wrapper: React.FC): React.ReactNode {
    return () => (
      <context.Provider value={this._store}>
        <Wrapper>
          <StepWrapper structure={this._config.structure} />
        </Wrapper>
      </context.Provider>
    );
  }
}

export const formBuilder = new FormBuilder();

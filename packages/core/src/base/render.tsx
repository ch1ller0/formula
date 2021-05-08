import React from 'react';
import { context } from '@reatom/react';
import { Fields } from '../features/field/field.gen';
import { StepWrapper } from '../features/step/step.gen';

import type { FeatureRegistry } from './featureRegistry';

const defaultWrapper: React.FC<{}> = ({ children }) => children;

const renderWrappers = (registry: FeatureRegistry) => {
  return <StepWrapper registry={registry} Component={Fields}></StepWrapper>;
};

export const renderComponent = (
  registry: FeatureRegistry,
  Wrapper: React.FC = defaultWrapper,
) => {
  const store = registry.getStore();

  return () => (
    <context.Provider value={store}>
      <Wrapper>{renderWrappers(registry)}</Wrapper>
    </context.Provider>
  );
};

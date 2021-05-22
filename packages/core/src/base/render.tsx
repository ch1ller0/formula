import React from 'react';
import { context } from '@reatom/react';
import { Fields } from '../features/field/field.gen';
import { StepWrapper } from '../features/step/step.gen';

import type { ProviderContainer } from './provider-container';

const defaultWrapper: React.FC<{}> = ({ children }) => children;

const renderWrappers = (providerContainer: ProviderContainer) => {
  return (
    <StepWrapper
      providerContainer={providerContainer}
      Component={Fields}
    ></StepWrapper>
  );
};

export const renderComponent = (
  providerContainer: ProviderContainer,
  Wrapper: React.FC = defaultWrapper,
) => {
  const store = providerContainer.getStore();

  return () => (
    <context.Provider value={store}>
      <Wrapper>{renderWrappers(providerContainer)}</Wrapper>
    </context.Provider>
  );
};

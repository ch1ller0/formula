import React from 'react';
import { useAtom } from '@reatom/react';
import { StepFeature } from './step.feature';

import type { ProviderContainer } from '../../base/provider-container';

export const StepWrapper: React.FC<{
  providerContainer: ProviderContainer;
  Component: React.FC<{
    currentStep: number;
    providerContainer: ProviderContainer;
  }>;
}> = ({ providerContainer, Component }) => {
  const atom = providerContainer.getProvider(StepFeature).getAtom();
  const currentStep = useAtom(atom);

  return (
    <React.Fragment key={currentStep.toString()}>
      <Component
        currentStep={currentStep}
        providerContainer={providerContainer}
      />
    </React.Fragment>
  );
};

import React from 'react';
import { useAtom } from '@reatom/react';
import { StepProvider } from './step.provider';

import type { ProviderContainer } from '../../../base/provider-container';

export const StepWrapper: React.FC<{
  providerContainer: ProviderContainer;
  Component: React.FC<{
    currentStep: number;
    providerContainer: ProviderContainer;
  }>;
}> = ({ providerContainer, Component }) => {
  const atom = providerContainer.getProvider(StepProvider).getAtom();
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

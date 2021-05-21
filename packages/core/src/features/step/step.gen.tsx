import React from 'react';
import { useAtom } from '@reatom/react';
import { StepFeature } from './step.feature';

import type { ProviderContainer } from '../../base/provider-container.ts';

export const StepWrapper: React.FC<{
  providerContainer: ProviderContainer;
  Component: React.FC<{
    currentStep: number;
    providerContainer: ProviderContainer;
  }>;
}> = ({ providerContainer, Component }) => {
  const prov = providerContainer.getProvider(StepFeature);
  const atom = prov.getAtom();
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

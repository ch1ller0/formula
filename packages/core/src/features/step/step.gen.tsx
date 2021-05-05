import React from 'react';
import { useAtom } from '@reatom/react';
import type { FeatureRegistry } from '../../base/featureRegistry';
import { StepFeature } from './step.feature';

export const StepWrapper: React.FC<{
  registry: FeatureRegistry;
  Component: React.FC<{ currentStep: number }>;
}> = ({ registry, Component }) => {
  const atom = registry.getFeature(StepFeature).getAtom();
  const currentStep = useAtom(atom) as number;

  return (
    <React.Fragment key={currentStep.toString()}>
      <Component currentStep={currentStep} registry={registry} />
    </React.Fragment>
  );
};

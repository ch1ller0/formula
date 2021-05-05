import React from 'react';
import type { StepStructure } from '../../types';
import { renderFields } from '../field/field.gen';

export const StepWrapper: React.FC<{
  structure: StepStructure[];
  provider: any;
}> = ({ provider, structure }) => {
  const currentStep = provider.service.getCurrentStep(); // @TODO

  return (
    <React.Fragment key={currentStep.toString()}>
      {renderFields(currentStep, structure)}
    </React.Fragment>
  );
};

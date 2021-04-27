import React from 'react';
import { useAtom } from '@reatom/react';
import { FieldWrapper } from './field-gen';
import { stepAtom } from './atoms/step.atom';
import toPairs from '@tinkoff/utils/object/toPairs';
import type { StepStructure } from '../types';

export const StepWrapper: React.FC<{ structure: StepStructure[] }> = ({
  structure,
}) => {
  const currentStep = useAtom(stepAtom);

  const paired = toPairs(structure[currentStep]);
  const fields = paired.map(([name, { props, ...innerProps }]) => {
    return (
      <FieldWrapper name={name} key={name} fieldProps={props} {...innerProps} />
    );
  });

  return <React.Fragment key={currentStep.toString()}>{fields}</React.Fragment>;
};

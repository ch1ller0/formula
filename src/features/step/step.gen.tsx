import React from 'react';
import { useAtom } from '@reatom/react';
import { FieldWrapper } from '../field/field.gen';
import { stepAtom } from './step.atom';
import toPairs from '@tinkoff/utils/object/toPairs';
import type { StepStructure } from '../../types';
import { Store } from '../../base/store';

export const StepWrapper: React.FC<{
  structure: StepStructure[];
  store: Store;
}> = ({ structure, store }) => {
  const currentStep = useAtom(stepAtom);

  const paired = toPairs(structure[currentStep]);
  const fields = paired.map(([name, { ...innerProps }]) => {
    return (
      <FieldWrapper name={name} key={name} store={store} {...innerProps} />
    );
  });

  return <React.Fragment key={currentStep.toString()}>{fields}</React.Fragment>;
};

import React from 'react';
import { useAtom } from '@reatom/react';

import type { Atom } from '@reatom/core';
import type { State } from './step.state';
import type { RenderProps } from '../../../base/render';

export const StepWrapperFabric = (
  atom: Atom<State>,
): React.FC<RenderProps> => ({ renderChildren, structure }) => {
  const currentStep = useAtom(atom, (value) => value.currentStep, []);

  return (
    <React.Fragment key={currentStep.toString()}>
      {renderChildren?.({ structure: [structure[currentStep]] })}
    </React.Fragment>
  );
};

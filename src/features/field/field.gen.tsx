import React from 'react';
import { useAction, useAtom } from '@reatom/react';
import { changeAction, fieldAtom } from './field.atom';
import { propsAtom } from '../props/props.atom';
import toPairs from '@tinkoff/utils/object/toPairs';

import type { FieldConfig } from '../../types';

const FieldWrapper: React.FC<FieldConfig> = ({ name, field }) => {
  const Component = field.render;

  const Consumer = () => {
    const changeKeyVal = useAction(changeAction);
    const fieldValue = useAtom(fieldAtom, (atom) => atom[name], []);
    const fieldProps = useAtom(propsAtom, (atom) => atom[name], []);

    const props = {
      name,
      value: fieldValue || '',
      setValue: (value) => {
        changeKeyVal({ name, value });
      },
    };

    if (!fieldProps) {
      return null;
    }

    return <Component {...fieldProps} {...props} key={name} />;
  };

  return <Consumer />;
};

export const renderFields = (currentStep, structure) => {
  const paired = toPairs(structure[currentStep]);
  return paired.map(([name, innerProps]) => {
    return <FieldWrapper name={name} key={name} {...innerProps} />;
  });
};

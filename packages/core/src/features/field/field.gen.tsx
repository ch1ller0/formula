import React from 'react';
import { useAction, useAtom } from '@reatom/react';
import toPairs from '@tinkoff/utils/object/toPairs';
import { FieldFeature, PropsFeature } from '../index';

import type { FeatureRegistry } from '../../base/featureRegistry';
import type { FieldConfig } from '../../types';

const FieldWrapper: React.FC<FieldConfig & { registry: FeatureRegistry }> = ({
  name,
  field,
  registry,
}) => {
  const Component = field.render;
  const fieldAtom = registry.getFeature(FieldFeature).getAtom();
  const fieldActions = registry.getFeature(FieldFeature).getActions();
  const propsAtom = registry.getFeature(PropsFeature).getAtom();

  const Consumer = () => {
    const changeKeyVal = useAction(fieldActions.changeAction);
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
      return <div>placeholder</div>;
    }

    return <Component {...fieldProps} {...props} key={name} />;
  };

  return <Consumer />;
};

export const Fields: React.FC<{
  registry: FeatureRegistry;
  currentStep: number;
}> = ({ registry, currentStep }) => {
  const { structure } = registry.getArguments();
  const paired = toPairs(structure[currentStep]);

  return paired.map(([name, innerProps]) => {
    return (
      <FieldWrapper
        name={name}
        key={name}
        registry={registry}
        {...innerProps}
      />
    );
  });
};

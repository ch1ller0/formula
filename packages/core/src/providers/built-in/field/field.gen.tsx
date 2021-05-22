import React from 'react';
import { useAction, useAtom } from '@reatom/react';
import toPairs from '@tinkoff/utils/object/toPairs';
import { FieldProvider, PropsProvider } from '../index';

import type { ProviderContainer } from '../../../base/provider-container';
import type { TFieldStructure, TPrimitive } from '../../../types';

const FieldWrapper: React.FC<
  TFieldStructure & { providerContainer: ProviderContainer; name: string }
> = ({ name, field, providerContainer }) => {
  const { render: Component } = field;
  const fieldAtom = providerContainer.getProvider(FieldProvider).getAtom();
  const fieldActions = providerContainer
    .getProvider(FieldProvider)
    .getActions();
  const propsAtom = providerContainer.getProvider(PropsProvider).getAtom();

  const Consumer = () => {
    const changeKeyVal = useAction(fieldActions.changeAction);
    const fieldValue = useAtom(fieldAtom, (atom) => atom[name], []);
    const fieldProps = useAtom(propsAtom, (atom) => atom[name], []);

    const props = {
      name,
      value: fieldValue,
      setValue: (value: TPrimitive) => {
        changeKeyVal({ name, value });
      },
    };

    if (!fieldProps) {
      throw new Error(
        'fieldProps are undefined - it might mean that you tried to render before store init',
      );
    }

    return <Component {...fieldProps} {...props} key={name} />;
  };

  return <Consumer />;
};

export const Fields: React.FC<{
  providerContainer: ProviderContainer;
  currentStep: number;
}> = ({ providerContainer, currentStep }) => {
  const { structure } = providerContainer.getConfig();
  const paired = toPairs(structure[currentStep]);

  return (
    <>
      {paired.map(([name, innerProps]) => (
        <FieldWrapper
          name={name}
          key={name}
          providerContainer={providerContainer}
          {...innerProps}
        />
      ))}
    </>
  );
};

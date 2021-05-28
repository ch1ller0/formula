import React from 'react';
import { useAction, useAtom } from '@reatom/react';
import toPairs from '@tinkoff/utils/object/toPairs';

import type { TFieldStructure, TPrimitive } from '../../../types/base.types';
import type { PayloadActionCreator, Atom } from '@reatom/core';
import type { RenderProps } from '../../../base/render';
import type { ChangeKeyValArgs } from './field.state';

type FactoryArgs = {
  atom: Atom<Record<string, TPrimitive>>;
  actions: {
    changeKeyVal: PayloadActionCreator<ChangeKeyValArgs>;
  };
  propsAtom: Atom<Record<string, unknown>>;
  onChange: (a: ChangeKeyValArgs) => void;
};

const FieldWrapper: React.FC<{
  selfProps: TFieldStructure;
  name: string;
  args: FactoryArgs;
}> = ({ selfProps, name, args }) => {
  const { render: Component } = selfProps.field;

  const Consumer = () => {
    const changeKeyVal = useAction(args.actions.changeKeyVal);
    const fieldValue = useAtom(args.atom, (atom) => atom[name], []);
    const fieldProps = useAtom(args.propsAtom, (atom) => atom[name], []);

    const props = {
      name,
      value: fieldValue,
      setValue: (value: TPrimitive) => {
        args.onChange({ name, value });
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

export const FieldsFactory = ({
  atom,
  actions,
  propsAtom,
  onChange,
}: FactoryArgs): React.FC<RenderProps> => ({ children, structure }) => {
  const paired = toPairs(structure[0]);

  return (
    <>
      {paired.map(([name, selfProps]) => {
        const args = { atom, actions, propsAtom, onChange };

        return (
          <FieldWrapper
            name={name}
            key={name}
            selfProps={selfProps}
            args={args}
          />
        );
      })}
      {children}
    </>
  );
};

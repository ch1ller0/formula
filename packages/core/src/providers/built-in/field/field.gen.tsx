import React from 'react';
import { useAction, useAtom } from '@reatom/react';
import toPairs from '@tinkoff/utils/object/toPairs';

import type { TFieldStructure, TPrimitive } from '../../../types/base.types';
import type { PayloadActionCreator, Atom } from '@reatom/core';
import type { RenderProps } from '../../../base/render';

type FactoryArgs = {
  atom: Atom<Record<string, TPrimitive>>;
  actions: {
    changeKeyVal: PayloadActionCreator<{
      name: string;
      value: TPrimitive;
    }>;
  };
  propsAtom: Atom<Record<string, unknown>>;
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
}: {
  atom: Atom<Record<string, TPrimitive | null>>;
  actions: {
    changeKeyVal: PayloadActionCreator<{
      name: string;
      value: TPrimitive;
    }>;
  };
  propsAtom: Atom<Record<string, unknown>>;
}): React.FC<RenderProps> => ({ children, structure }) => {
  const paired = toPairs(structure[0]);

  return (
    <>
      {paired.map(([name, selfProps]) => {
        const args = { atom, actions, propsAtom };

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

import React from 'react';
import { useAction, useAtom } from '@reatom/react';
import { changeAction, fieldAtom } from './field.atom';
import { propsAtom } from '../props/props.atom';

export const FieldWrapper = ({ name, field, onAction, store }: any) => {
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
      onAction: onAction?.fn(store),
    };

    if (!fieldProps) {
      return null;
    }

    return <Component {...props} key={name} props={fieldProps} />;
  };

  return <Consumer />;
};

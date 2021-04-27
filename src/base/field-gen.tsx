import React from 'react';
import { useAction, useAtom } from '@reatom/react';
import { changeAction, fieldsAtom } from './atoms/fields.atom';
import { combinedStore } from './atoms/index';

export const FieldWrapper = ({ name, field, fieldProps, onAction }: any) => {
  const Component = field.render;

  const Consumer = () => {
    const changeKeyVal = useAction(changeAction);
    const fieldValue = useAtom(fieldsAtom, (atom) => atom[name], []);

    const props = {
      name,
      value: fieldValue || '',
      setValue: (value) => {
        changeKeyVal({ name, value });
      },
      onAction: onAction?.fn(combinedStore),
    };

    return <Component {...props} key={name} props={fieldProps} />;
  };

  return <Consumer />;
};

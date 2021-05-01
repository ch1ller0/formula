import React from 'react';
import { useAction, useAtom } from '@reatom/react';
import { changeAction, fieldAtom } from './field.atom';

export const FieldWrapper = ({
  name,
  field,
  fieldProps,
  onAction,
  store,
}: any) => {
  const Component = field.render;

  const Consumer = () => {
    const changeKeyVal = useAction(changeAction);
    const fieldValue = useAtom(fieldAtom, (atom) => atom[name], []);

    const props = {
      name,
      value: fieldValue || '',
      setValue: (value) => {
        changeKeyVal({ name, value });
      },
      onAction: onAction?.fn(store),
    };

    return <Component {...props} key={name} props={fieldProps} />;
  };

  return <Consumer />;
};

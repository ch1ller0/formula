import { FormBuilder, BuiltInProviders } from '@formula/core';
import { ValidationProvider } from '@formula/provider-validation';

import { requiredValidator } from './shared/validators';
import { InputFieldView, SubmitButtonView } from './shared/fields';
import { boxWrapper } from './shared/wrapper';

// const { FieldProvider, PropsProvider } = BuiltInProviders;

const cityArray = (array) =>
  array({
    country: {
      field: InputFieldView,
      props: { label: 'Country' },
    },
    city: {
      field: InputFieldView,
      props: { label: 'City' },
    },
  });

export default {
  title: 'Example/FBForm/Array',
  component: <div>placeholder</div>,
};

const ArrayStory = () => {
  const Cmp = new FormBuilder()
    .addProviders([ValidationProvider])
    // .initDeps()
    .buildStructure(({ group, array }) => ({
      0: group({
        email: {
          field: InputFieldView,
          props: { label: 'Your email' },
        },
        // addresses: cityArray(array),
        // button to add new phone - need controls
        add_address_button: {
          field: SubmitButtonView,
          props: {
            label: 'New Address',
          },
        },
      }),
    }))
    .toComponent(boxWrapper);
  return <Cmp />;
};

export const Array = ArrayStory.bind({});

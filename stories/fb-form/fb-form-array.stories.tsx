import { formBuilder } from '@formula/core';
import { CoreTokens } from '@formula/module-core';
import { ValidationModule, VALIDATION_BINDERS_TOKEN } from '@formula/module-validation';

import { InputFieldView, SubmitButtonView, ThankYouView, TextFieldView } from './shared/fields';
import { requiredValidator, lengthValidator } from './shared/validators';
import { boxWrapper } from './shared/wrapper';

const { SCREEN_BINDERS_TOKEN, STRUCTURE_BINDERS_TOKEN } = CoreTokens;

const builder = formBuilder()
  .configure({ modules: [ValidationModule], providers: [] })
  .build(({ array, group }) => ({
    // first step
    0: group({
      caption1: {
        field: TextFieldView,
        props: { text: 'Arrays' },
      },
      addresses_array: array(
        (index) => ({
          address: {
            field: InputFieldView,
            props: { label: `City #${index}` },
            controls: (get) => [
              get(VALIDATION_BINDERS_TOKEN).validateField([requiredValidator, lengthValidator({ min: 6 })]),
            ],
          },
          remove_button: {
            field: SubmitButtonView,
            props: { label: 'remove', appearance: 'link' },
            controls: (get) => [get(STRUCTURE_BINDERS_TOKEN).removeRow()],
          },
        }),
        { count: 3 },
      ),
      add_button: {
        field: SubmitButtonView,
        props: { label: 'Add row' },
        controls: (get) => [get(STRUCTURE_BINDERS_TOKEN).appendRow({ arrName: 'arr.addresses_array' })],
      },
      finish_button: {
        field: SubmitButtonView,
        props: { label: 'Finish' },
        controls: (get) => [get(SCREEN_BINDERS_TOKEN).nextScreen(), get(VALIDATION_BINDERS_TOKEN).screenDisabled()],
      },
    }),
    1: group({
      thank_you: {
        field: ThankYouView,
        props: {
          title: 'No title',
          link: {
            href: 'https://fridgefm.com',
            label: 'Please visit ',
          },
        },
      },
    }),
  }));

const ArrayStory = () => {
  const Cmp = builder.toComponent(boxWrapper);
  return <Cmp />;
};

export default {
  title: 'Example/FBForm/Array',
  component: <div>placeholder</div>,
  parameters: {
    // providers: builder._getDebugProviders(),
  },
};

export const Array = ArrayStory.bind({});

import { formBuilder } from '@formula/core';
import { CoreTokens } from '@formula/module-core';
import { ValidationModule, VALIDATION_BINDERS_TOKEN } from '@formula/module-validation';

import { pluck, filter } from 'rxjs/operators';
import { CheckboxFieldView, InputFieldView, SubmitButtonView, TextFieldView, ThankYouView } from './shared/fields';
import { requiredValidator, lengthValidator } from './shared/validators';
import { boxWrapper } from './shared/wrapper';

const { STRUCTURE_SERVICE_TOKEN, FIELD_SERVICE_TOKEN, SCREEN_BINDERS_TOKEN } = CoreTokens;
const builder = formBuilder()
  .configure({ modules: [ValidationModule], providers: [] })
  .build(({ group }) => ({
    0: group({
      caption1: {
        field: TextFieldView,
        props: {
          text: 'Conditional groups',
        },
      },
      have_email: {
        field: CheckboxFieldView,
        props: {
          label: 'I dont have an email',
        },
        controls: (get) => [
          (fieldName) => {
            get(FIELD_SERVICE_TOKEN)
              .getDiffRx()
              .pipe(
                filter((a) => a.fieldName === fieldName),
                pluck('value'),
              )
              .subscribe(() => {
                get(STRUCTURE_SERVICE_TOKEN).toggleGroupsVisibility([
                  'grp.personal_info_with_email',
                  'grp.personal_info_without_email',
                ]);
              });
          },
        ],
      },
      personal_info_with_email: group(
        {
          nickname: {
            field: InputFieldView,
            props: { label: 'Nickname' },
            controls: (get) => {
              return [get(VALIDATION_BINDERS_TOKEN).validateField([requiredValidator, lengthValidator({ min: 6 })])];
            },
          },
          email1: {
            field: InputFieldView,
            props: { label: 'Email' },
            controls: (get) => [
              get(VALIDATION_BINDERS_TOKEN).validateField([requiredValidator, lengthValidator({ min: 6 })]),
            ],
          },
        },
        {
          horizontal: true,
        },
      ),
      personal_info_without_email: group(
        {
          first_name: {
            field: InputFieldView,
            props: { label: 'First name' },
            controls: (get) => [
              get(VALIDATION_BINDERS_TOKEN).validateField([requiredValidator, lengthValidator({ min: 6 })]),
            ],
          },
          second_name: {
            field: InputFieldView,
            props: { label: 'Second name' },
            controls: (get) => [
              get(VALIDATION_BINDERS_TOKEN).validateField([requiredValidator, lengthValidator({ min: 6 })]),
            ],
          },
        },
        { invisible: true },
      ),
      next_button1: {
        field: SubmitButtonView,
        props: {
          label: 'Finish',
        },
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

const ConditionalGroupStory = () => {
  const Cmp = builder.toComponent(boxWrapper);
  return <Cmp />;
};

export default {
  title: 'Example/FBForm',
  component: ConditionalGroupStory,
  parameters: {
    // providers: builder._getDebugProviders(),
  },
};

export const ConditionalGroup = ConditionalGroupStory.bind({});

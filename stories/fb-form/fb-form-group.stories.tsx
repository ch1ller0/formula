import { FormBuilder, CoreTokens } from '@formula/core';
import { ValidationModule, VALIDATION_SERVICE_TOKEN } from '@formula/provider-validation';

import { InputFieldView, SubmitButtonView, ThankYouView, TextFieldView } from './shared/fields';
import { requiredValidator, lengthValidator } from './shared/validators';
import { boxWrapper } from './shared/wrapper';

const { STEP_SERVICE_TOKEN } = CoreTokens;

const GroupStory = () => {
  const Cmp = new FormBuilder()
    .addProviders(ValidationModule)
    .buildStructure(({ group }) => ({
      // first step
      0: group({
        caption1: {
          field: TextFieldView,
          props: {
            text: '3 elements in a row',
          },
        },
        personal_info1: group(
          {
            first_name1: {
              field: InputFieldView,
              props: { label: 'Fortnite nickname' },
              controls: ({ getBinders }) => [
                getBinders(VALIDATION_SERVICE_TOKEN).validateField([requiredValidator, lengthValidator({ min: 6 })]),
              ],
            },
            email1: {
              field: InputFieldView,
              props: { label: 'Email' },
              controls: ({ getBinders }) => [
                getBinders(VALIDATION_SERVICE_TOKEN).validateField([requiredValidator, lengthValidator({ min: 6 })]),
              ],
            },
            next_button1: {
              field: SubmitButtonView,
              props: {
                label: 'Finish',
              },
              controls: ({ getBinders }) => [
                getBinders(STEP_SERVICE_TOKEN).nextStep(),
                getBinders(VALIDATION_SERVICE_TOKEN).stepDisabled(),
              ],
            },
          },
          {
            horizontal: true,
          },
        ),
        caption2: {
          field: TextFieldView,
          props: {
            text: '2 elements in a row',
          },
        },
        personal_info2: group(
          {
            first_name2: {
              field: InputFieldView,
              props: { label: 'Fortnite nickname' },
              controls: ({ getBinders }) => [
                getBinders(VALIDATION_SERVICE_TOKEN).validateField([requiredValidator, lengthValidator({ min: 6 })]),
              ],
            },
            email2: {
              field: InputFieldView,
              props: { label: 'Email' },
              controls: ({ getBinders }) => [
                getBinders(VALIDATION_SERVICE_TOKEN).validateField([requiredValidator, lengthValidator({ min: 6 })]),
              ],
            },
          },
          {
            horizontal: true,
          },
        ),
        next_button2: {
          field: SubmitButtonView,
          props: {
            label: 'Finish',
          },
          controls: ({ getBinders }) => [
            getBinders(STEP_SERVICE_TOKEN).nextStep(),
            getBinders(VALIDATION_SERVICE_TOKEN).stepDisabled(),
          ],
        },
        caption3: {
          field: TextFieldView,
          props: {
            text: '3 elements in a column',
          },
        },
        personal_info3: group({
          first_name3: {
            field: InputFieldView,
            props: { label: 'Fortnite nickname' },
            controls: ({ getBinders }) => [
              getBinders(VALIDATION_SERVICE_TOKEN).validateField([requiredValidator, lengthValidator({ min: 6 })]),
            ],
          },
          email3: {
            field: InputFieldView,
            props: { label: 'Email' },
            controls: ({ getBinders }) => [
              getBinders(VALIDATION_SERVICE_TOKEN).validateField([requiredValidator, lengthValidator({ min: 6 })]),
            ],
          },
          next_button3: {
            field: SubmitButtonView,
            props: {
              label: 'Finish',
            },
            controls: ({ getBinders }) => [
              getBinders(STEP_SERVICE_TOKEN).nextStep(),
              getBinders(VALIDATION_SERVICE_TOKEN).stepDisabled(),
            ],
          },
        }),
      }),
      // first step
      1: group({
        thank_you: {
          field: ThankYouView,
          props: {
            title: 'The form is over',
            link: {
              href: 'https://fridgefm.com',
              label: 'Please visit ',
            },
          },
        },
      }),
    }))
    .toComponent(boxWrapper);

  return <Cmp />;
};

export default {
  title: 'Example/FBForm/Group',
  component: <div>placeholder</div>,
};

export const Group = GroupStory.bind({});

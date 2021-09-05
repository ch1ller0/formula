import { FormBuilder, CoreTokens } from '@formula/core';
import { ValidationProvider, VALIDATION_SERVICE_TOKEN } from '@formula/provider-validation';

import { pluck, filter } from 'rxjs/operators';
import { CheckboxFieldView, InputFieldView, SubmitButtonView, TextFieldView, ThankYouView } from './shared/fields';
import { requiredValidator, lengthValidator } from './shared/validators';
import { boxWrapper } from './shared/wrapper';

const { STEP_SERVICE_TOKEN, STRUCTURE_SERVICE_TOKEN, FIELD_SERVICE_TOKEN } = CoreTokens;

const ConditionalGroupStory = () => {
  const Cmp = new FormBuilder()
    .addProviders([ValidationProvider])
    .buildStructure(({ group }) => ({
      // first step
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
          controls: ({ getService }) => [
            (fieldName) => {
              getService(FIELD_SERVICE_TOKEN)
                .getDiffRx()
                .pipe(
                  filter((a) => a.name === fieldName),
                  pluck('value'),
                )
                .subscribe(() => {
                  getService(STRUCTURE_SERVICE_TOKEN).toggleGroupsVisibility([
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
              controls: ({ getBinders }) => [
                getBinders(VALIDATION_SERVICE_TOKEN).validateField([requiredValidator, lengthValidator({ min: 6 })]),
              ],
            },
            second_name: {
              field: InputFieldView,
              props: { label: 'Second name' },
              controls: ({ getBinders }) => [
                getBinders(VALIDATION_SERVICE_TOKEN).validateField([requiredValidator, lengthValidator({ min: 6 })]),
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
          controls: ({ getBinders }) => [
            getBinders(STEP_SERVICE_TOKEN).nextStep(),
            getBinders(VALIDATION_SERVICE_TOKEN).stepDisabled(),
          ],
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
    }))
    .toComponent(boxWrapper);

  return <Cmp />;
};

export default {
  title: 'Example/FBForm',
  component: ConditionalGroupStory,
};

export const ConditionalGroup = ConditionalGroupStory.bind({});

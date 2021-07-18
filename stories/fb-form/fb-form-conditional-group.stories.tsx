import { FormBuilder, BuiltInProviders } from '@formula/core';
import { ValidationProvider } from '@formula/provider-validation';

import {
  CheckboxFieldView,
  InputFieldView,
  SubmitButtonView,
  TextFieldView,
} from './shared/fields';
import { pluck, filter } from 'rxjs/operators';
import { requiredValidator, lengthValidator } from './shared/validators';
import { boxWrapper } from './shared/wrapper';

const { StepProvider, StructureProvider, FieldProvider } = BuiltInProviders;

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
          controls: ({ getBinders, getService }) => [
            (fieldName) => {
              getService(FieldProvider)
                .getDiffRx()
                .pipe(
                  filter((a) => a.name === fieldName),
                  pluck('value'),
                )
                .subscribe((e) => {
                  getService(StructureProvider).toggleGroupsVisibility([
                    'personal_info_with_email',
                    'personal_info_without_email',
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
                getBinders(ValidationProvider).validateField([
                  requiredValidator,
                  lengthValidator({ min: 6 }),
                ]),
              ],
            },
            email1: {
              field: InputFieldView,
              props: { label: 'Email' },
              controls: ({ getBinders }) => [
                getBinders(ValidationProvider).validateField([
                  requiredValidator,
                  lengthValidator({ min: 6 }),
                ]),
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
              props: { label: 'Full name' },
            },
          },
          { visible: false },
        ),
        next_button1: {
          field: SubmitButtonView,
          props: {
            label: 'Finish',
          },
          controls: ({ getBinders }) => [
            getBinders(StepProvider).nextStep(),
            getBinders(ValidationProvider).stepDisabled(),
          ],
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

export const ConditionalGroup = ConditionalGroupStory.bind({});

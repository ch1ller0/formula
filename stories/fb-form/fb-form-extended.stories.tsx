import { debounceTime, distinctUntilKeyChanged, pluck } from 'rxjs/operators';

import { FormBuilder, CoreTokens } from '@formula/core';
import { ValidationProvider, VALIDATION_SERVICE_TOKEN } from '@formula/provider-validation';

import {
  InputFieldView,
  SelectFieldView,
  RadioFieldView,
  CheckboxFieldView,
  SubmitButtonView,
  ThankYouView,
} from './shared/fields';
import { requiredValidator, lengthValidator } from './shared/validators';
import { boxWrapper } from './shared/wrapper';

const { STEP_SERVICE_TOKEN, FIELD_SERVICE_TOKEN, PROPS_SERVICE_TOKEN } = CoreTokens;

const ExtendedStory = () => {
  const Cmp = new FormBuilder()
    .addProviders([ValidationProvider])
    .buildStructure(({ group }) => ({
      // first step
      0: group({
        first_name: {
          field: InputFieldView,
          // @TODO infer type here
          props: { label: 'Your name' },
          controls: ({ getBinders }) => [
            getBinders(VALIDATION_SERVICE_TOKEN).validateField([requiredValidator, lengthValidator({ min: 6 })]),
          ],
        },
        location: {
          field: SelectFieldView,
          props: {
            label: 'Location',
            options: [
              { label: 'New York', value: 'new_york' },
              { label: 'St Petersburg', value: 'st_petersburg' },
              { label: 'Moscow', value: 'moscow' },
            ],
          },
          controls: ({ getBinders }) => [
            getBinders(VALIDATION_SERVICE_TOKEN).validateField([
              requiredValidator,
              (value: string) => {
                return ['st_petersburg', 'moscow'].includes(value)
                  ? undefined
                  : 'Only russian cities are currently supported';
              },
            ]),
          ],
        },
        gender: {
          field: RadioFieldView,
          props: {
            label: 'Gender',
            options: [
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'attack_helicopter', label: 'Attack Helicopter' },
              { value: 'other', label: 'Other' },
            ],
          },
        },
        remember_me: {
          field: CheckboxFieldView,
          props: {
            label: 'Remember me',
          },
        },
        next_button1: {
          field: SubmitButtonView,
          props: {
            label: 'Next',
          },
          controls: ({ getBinders }) => [
            getBinders(STEP_SERVICE_TOKEN).nextStep(),
            getBinders(VALIDATION_SERVICE_TOKEN).stepDisabled(),
          ],
        },
      }),
      // first step
      1: group({
        fav_fruit: {
          field: InputFieldView,
          props: { label: 'What is your favorite fruit?' },
        },
        is_veg: {
          field: CheckboxFieldView,
          props: {
            label: 'I am a vegaterian',
            value: true,
          },
          controls: ({ getBinders }) => [
            getBinders(VALIDATION_SERVICE_TOKEN).validateField([(v) => !v && 'Vegging is required']),
          ],
        },
        next_button2: {
          field: SubmitButtonView,
          props: {
            label: 'Finalize',
          },
          controls: ({ getBinders }) => [
            getBinders(STEP_SERVICE_TOKEN).nextStep(),
            getBinders(VALIDATION_SERVICE_TOKEN).stepDisabled(),
          ],
        },
      }),
      // first step
      2: group({
        thank_you: {
          field: ThankYouView,
          props: {
            title: 'No title',
            link: {
              href: 'https://fridgefm.com',
              label: 'Please visit ',
            },
          },
          // custom feature for this field
          controls: ({ getService }) => [
            (fieldName) => {
              const watchField = 'fld.first_name';
              getService(FIELD_SERVICE_TOKEN)
                .getRxStore()
                .pipe(distinctUntilKeyChanged(watchField), pluck(watchField), debounceTime(300))
                .subscribe((firstName) => {
                  const title = `Thank you for your feedback, ${firstName}`;
                  getService(PROPS_SERVICE_TOKEN).setFieldProp(fieldName, {
                    title,
                  });
                });
            },
          ],
        },
      }),
    }))
    .toComponent(boxWrapper);

  return <Cmp />;
};

export default {
  title: 'Example/FBForm/Extended',
  component: <div>placeholder</div>,
};

export const Extended = ExtendedStory.bind({});

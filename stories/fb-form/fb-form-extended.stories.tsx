import { debounceTime, distinctUntilKeyChanged, pluck } from 'rxjs/operators';
import { formBuilder } from '@formula/core';
import { CoreTokens } from '@formula/module-core';
import { ValidationModule, VALIDATION_BINDERS_TOKEN } from '@formula/module-validation';
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

const { FIELD_SERVICE_TOKEN, PROPS_SERVICE_TOKEN, SCREEN_BINDERS_TOKEN } = CoreTokens;

const builder = formBuilder()
  .configure({ modules: [ValidationModule], providers: [] })
  .build(({ group }) => ({
    0: group({
      first_name: {
        field: InputFieldView,
        props: { label: 'Your name' },
        controls: (get) => [
          get(VALIDATION_BINDERS_TOKEN).validateField([requiredValidator, lengthValidator({ min: 6 })]),
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
        controls: (get) => [
          get(VALIDATION_BINDERS_TOKEN).validateField([
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
        controls: (get) => [get(SCREEN_BINDERS_TOKEN).nextScreen(), get(VALIDATION_BINDERS_TOKEN).screenDisabled()],
      },
    }),
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
        controls: (get) => [get(VALIDATION_BINDERS_TOKEN).validateField([(v) => !v && 'Vegging is required'])],
      },
      next_button2: {
        field: SubmitButtonView,
        props: {
          label: 'Finalize',
        },
        controls: (get) => [get(SCREEN_BINDERS_TOKEN).nextScreen(), get(VALIDATION_BINDERS_TOKEN).screenDisabled()],
      },
    }),
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
        controls: (get) => [
          (fieldName) => {
            const watchField = 'fld.first_name';
            get(FIELD_SERVICE_TOKEN)
              .getRxStore()
              .pipe(distinctUntilKeyChanged(watchField), pluck(watchField), debounceTime(300))
              .subscribe((firstName) => {
                const title = `Thank you for your feedback, ${firstName}`;
                get(PROPS_SERVICE_TOKEN).setFieldProp(fieldName, {
                  title,
                });
              });
          },
        ],
      },
    }),
  }));

const ExtendedStory = () => {
  const Cmp = builder.toComponent(boxWrapper);
  return <Cmp />;
};

export default {
  title: 'Example/FBForm/Extended',
  component: ExtendedStory,
  parameters: {
    // providers: builder._getDebugProviders(),
  },
};

export const Extended = ExtendedStory.bind({});

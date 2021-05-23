import { debounceTime, distinctUntilKeyChanged, pluck } from 'rxjs/operators';

import {
  InputFieldView,
  SelectFieldView,
  RadioFieldView,
  CheckboxFieldView,
  SubmitButtonView,
  ThankYouView,
} from './shared/fields';
import {
  FormBuilder,
  BuiltInProviders,
  ExternalProviders,
} from '../../packages/core/src';
import { requiredValidator, lengthValidator } from './shared/validators';
import { boxWrapper } from './shared/wrapper';
import {
  FieldProvider,
  PropsProvider,
} from '../../packages/core/src/providers/built-in';

const { StepProvider } = BuiltInProviders;
const { ValidationProvider } = ExternalProviders;

export const FBForm = new FormBuilder()
  .addProviders([ValidationProvider])
  .addStep({
    first_name: {
      field: InputFieldView,
      // @TODO infer type here
      props: { label: 'Your name' },
      controls: (getProvider) => [
        getProvider(ValidationProvider).bindValidation([
          requiredValidator,
          lengthValidator({ min: 6 }),
        ]),
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
    },
    gender: {
      field: RadioFieldView,
      props: {
        label: 'Gender',
        options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
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
      controls: (getProvider) => [
        getProvider(StepProvider).bindNextStep(),
        getProvider(ValidationProvider).bindDisabled(),
      ],
    },
  })
  .addStep({
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
      controls: (getProvider) => [
        getProvider(ValidationProvider).bindValidation([
          (v) => !v && 'Vegging is required',
        ]),
      ],
    },
    next_button2: {
      field: SubmitButtonView,
      props: {
        label: 'Finalize',
      },
      controls: (getProvider) => [
        getProvider(StepProvider).bindNextStep(),
        getProvider(ValidationProvider).bindDisabled(),
      ],
    },
  })
  .addStep({
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
      controls: (getProvider) => [
        ({ initiator: { fieldName } }) => {
          const watchField = 'first_name';
          getProvider(FieldProvider)
            .getRxStore()
            .pipe(
              distinctUntilKeyChanged(watchField),
              pluck(watchField),
              debounceTime(300),
            )
            .subscribe((firstName) => {
              const title = `Thank you for your feedback, ${firstName}`;
              getProvider(PropsProvider).setFieldProp(fieldName, { title });
            });
        },
      ],
    },
  })
  .toComponent(boxWrapper);

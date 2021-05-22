import { Box } from 'rebass';
import { ThemeProvider } from 'emotion-theming';

import {
  InputFieldView,
  SelectFieldView,
  RadioFieldView,
  CheckboxFieldView,
  SubmitButtonView,
  ThankYouView,
} from './fb-form.fields';
import {
  FormBuilder,
  BuiltInProviders,
  ExternalProviders,
} from '../../packages/core/src';
import { requiredValidator, lengthValidator } from './validators';

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
        getProvider(ValidationProvider).validate([
          requiredValidator,
          lengthValidator({ min: 6 }),
        ]),
      ],
    },
    location: {
      field: SelectFieldView,
      props: {
        label: 'Location',
        options: ['New York', 'St Petersburg', 'Moscow'],
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
        getProvider(ValidationProvider).toggleDisabled(),
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
        getProvider(ValidationProvider).validate([
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
        getProvider(ValidationProvider).toggleDisabled(),
      ],
    },
  })
  .addStep({
    thank_you: {
      field: ThankYouView,
      props: {
        title: 'Thank You for your feedback, $username',
        link: {
          href: 'https://fridgefm.com',
          label: 'Please visit ',
        },
      },
    },
  })
  .toComponent(({ children }) => {
    return (
      <ThemeProvider
        theme={{
          colors: {
            background: 'black',
            primary: 'tomato',
            disconnect: '#bbb',
          },
          space: [0, 6, 12, 24, 48],
          fontSizes: [14, 16, 18, 20, 24],
          radii: {
            default: 5,
          },
        }}
      >
        <Box
          as="form"
          onSubmit={(e) => {
            e.preventDefault();
          }}
          py={3}
        >
          {children}
        </Box>
      </ThemeProvider>
    );
  });

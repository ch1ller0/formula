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
import { FormBuilder } from '../../src/index';
import { ValidationFeature } from '../../src/features/validation/validation.feature';
import { PropsFeature } from '../../src/features/props/props.feature';
import { StepFeature } from '../../src/features/step/step.feature';
import { FieldFeature } from '../../src/features/field/field.feature';

const requiredValidator = (v: string) =>
  !v?.length ? 'Field is required' : undefined;

const lengthValidator = ({
  min = 0,
  max = 30,
}: {
  min?: number;
  max?: number;
}) => (v: string) => {
  const { length } = v;
  if (length > max || length < min) {
    return `Length should be between ${min} and ${max}`;
  }
};

export const FBForm = new FormBuilder()
  .addFeatures([FieldFeature, PropsFeature, StepFeature, ValidationFeature])
  .addStep({
    first_name: {
      field: InputFieldView,
      // @TODO infer type here
      props: { label: 'Your name' },
      controls: (feature) => [
        feature(ValidationFeature).validate([
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
      controls: (feature) => [
        feature(StepFeature).bindNextStep(),
        feature(ValidationFeature).isStepValid(),
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
      },
      controls: (feature) => [
        feature(ValidationFeature).validate([
          (v) => !v && 'Vegging is required',
        ]),
      ],
    },
    next_button2: {
      field: SubmitButtonView,
      props: {
        label: 'Finalize',
      },
      controls: (feature) => [
        feature(StepFeature).bindNextStep(),
        feature(ValidationFeature).isStepValid(),
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

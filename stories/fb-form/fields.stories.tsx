import { formBuilder } from '@formula/core';
import {
  InputFieldView,
  SelectFieldView,
  RadioFieldView,
  CheckboxFieldView,
  SubmitButtonView,
  ThankYouView,
} from './shared/fields';
import type { TScreenStructure } from '@formula/core-types';

export default {
  title: 'Example/Fields',
  component: <div>placeholder</div>,
  parameters: {
    // pure core providers
    providers: formBuilder().build(({ group }) => ({
      0: group({
        dumb_input: {
          field: InputFieldView,
          props: { label: 'Dumb input field' },
        },
      }),
    })),
    // ._getDebugProviders(),
  },
};

const SingleField = (screen: TScreenStructure) => {
  const CMP = formBuilder()
    .build(({ group }) => ({ 0: group(screen) }))
    .toComponent(({ children }) => <form>{children}</form>);
  return <CMP />;
};

export const Input = () =>
  SingleField({
    dumb_input: {
      field: InputFieldView,
      props: { label: 'Dumb input field' },
    },
  });

export const Select = () =>
  SingleField({
    dumb_input: {
      field: SelectFieldView,
      props: {
        label: 'Dumb select field',
        options: [
          { label: 'Option 1', value: 'opt1' },
          { label: 'Option 2', value: 'opt2' },
          { label: 'Option 3', value: 'opt3' },
        ],
      },
    },
  });

export const Radio = () =>
  SingleField({
    dumb_input: {
      field: RadioFieldView,
      props: {
        label: 'Dumb radio field',
        options: [
          { label: 'Option 1', value: 'opt1' },
          { label: 'Option 2', value: 'opt2' },
        ],
      },
    },
  });

export const Checkbox = () =>
  SingleField({
    dumb_input: {
      field: CheckboxFieldView,
      props: {
        label: 'Simple checkbox?',
      },
    },
  });

export const Submit = () =>
  SingleField({
    dumb_input: {
      field: SubmitButtonView,
      props: {
        label: 'Go next',
      },
    },
  });

export const Result = () =>
  SingleField({
    dumb_input: {
      field: ThankYouView,
      props: {
        title: 'That`s all folks',
        link: {
          title: 'There link',
          href: 'https://fridgefm.com',
        },
      },
    },
  });

import React from 'react';
import { Form } from './form';

export default {
  title: 'Example/Form',
  component: Form,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const Template = (args) => <Form {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Button',
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'Button',
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  label: 'Button',
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  label: 'Button',
};

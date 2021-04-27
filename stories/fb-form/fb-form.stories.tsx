import { FBForm } from './fb-form';

export default {
  title: 'Example/FBForm',
  component: FBForm,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const Template = (args) => <FBForm {...args} />;

export const Primary = Template.bind({});

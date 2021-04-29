import { FBForm } from './fb-form';

export default {
  title: 'Example/FBForm',
  component: FBForm,
};

const Template = (args) => <FBForm {...args} />;

export const Primary = Template.bind({});

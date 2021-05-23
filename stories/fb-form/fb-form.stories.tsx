import { FBForm as FBForm1 } from './fb-form-1';

export default {
  title: 'Example/FBForm',
  component: <div>placeholder</div>,
};

const F1 = (args) => <FBForm1 {...args} />;
// const F2 = (args) => <FBForm {...args} />;

export const Extended = F1.bind({});
// export const Primary = F2.bind({});

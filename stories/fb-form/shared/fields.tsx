import { Label } from '@rebass/forms';
import { Box, Text as RText } from 'rebass';
import {
  Button,
  Input,
  SelectPicker,
  RadioGroup,
  Radio,
  Checkbox,
} from 'rsuite';
import { ViewGenerator } from '@formula/core';
import 'rsuite/dist/styles/rsuite-default.css';

const Text = (props: any) => (
  <RText
    fontFamily={'system-ui'}
    fontSize={props.fontSize || 3}
    fontWeight="normal"
    color="black"
    {...props}
  >
    {props.children}
  </RText>
);

const Boxify: React.FC<{ error?: string }> = ({ children, error }) => {
  return (
    <>
      <Box
        p={5}
        fontSize={2}
        width={[1, 1, 1 / 2]}
        sx={{
          margin: [0, 1, 2],
        }}
      >
        {children}
        {error ? (
          <Text fontSize={1} color="red">
            {error}
          </Text>
        ) : null}
      </Box>
    </>
  );
};

export const InputFieldView = ViewGenerator.field<{
  label: string;
  error: string;
}>({
  name: 'input',
  initialValue: () => '',
  render: ({ value, setValue, name, label, error }) => {
    const onChange = (value: string) => {
      setValue(value);
    };

    return (
      <Boxify error={error}>
        {label && (
          <Label htmlFor={name}>
            <Text>{label}</Text>
          </Label>
        )}
        <Input
          id={name}
          name={name}
          // @TODO infer type instead of TPrimitive
          value={value}
          onChange={onChange}
          size="lg"
        />
      </Boxify>
    );
  },
});

export const SelectFieldView = ViewGenerator.field<{
  label: string;
  options: { label: string; value: string }[];
  error: string;
}>({
  name: 'select',
  initialValue: ({ options }) => options[0].value,
  render: ({ value, setValue, label, options, error, name }) => {
    const onChange = (value: string) => {
      setValue(value);
    };

    return (
      <Boxify error={error}>
        {label && (
          <Label htmlFor={name}>
            <Text>{label}</Text>
          </Label>
        )}
        <SelectPicker
          data={options}
          block
          searchable={false}
          cleanable={false}
          size="lg"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
        />
      </Boxify>
    );
  },
});

export const RadioFieldView = ViewGenerator.field<{
  options: { value: string; label: string }[];
  label: string;
  error: string;
}>({
  name: 'radio',
  initialValue: ({ options }) => options[0].value,
  render: ({ value: selectedValue, setValue, label, options, name, error }) => {
    const onChange = (value: string) => {
      setValue(value);
    };

    return (
      <Boxify error={error}>
        {label && (
          <Label htmlFor={name}>
            <Text>{label}</Text>
          </Label>
        )}
        <RadioGroup
          appearance="default"
          name="radioList"
          inline
          onChange={onChange}
          value={selectedValue}
        >
          {options.map((a) => (
            <Radio key={a.value} value={a.value}>
              {a.label}
            </Radio>
          ))}
        </RadioGroup>
      </Boxify>
    );
  },
});

export const CheckboxFieldView = ViewGenerator.field<{
  label: string;
  error: string;
}>({
  name: 'checkbox',
  initialValue: () => false,
  render: ({ value, setValue, name, label, error }) => {
    const onChange = (_, value: boolean) => {
      setValue(value);
    };

    return (
      <Boxify error={error}>
        <Checkbox
          style={{
            marginLeft: 0,
          }}
          id={name}
          name={name}
          onChange={onChange}
          checked={value}
          inline
        >
          {label}
        </Checkbox>
      </Boxify>
    );
  },
});

export const SubmitButtonView = ViewGenerator.field<{
  label: string;
  disabled: boolean;
}>({
  name: 'submit',
  initialValue: () => null,
  render: ({ setValue, label, disabled }) => {
    const onClick = () => {
      setValue(null);
    };

    return (
      <Boxify>
        <Button
          appearance={disabled ? 'subtle' : 'primary'}
          onClick={onClick}
          size="lg"
        >
          {label}
        </Button>
      </Boxify>
    );
  },
});

export const ThankYouView = ViewGenerator.field<{
  title: string;
  link: { href: string; label: string };
}>({
  name: 'final-page',
  initialValue: () => null,
  render: ({ title, link: { href, label } }) => (
    <Boxify>
      <Label width={[1]} p={2}>
        <Text>{title}</Text>
      </Label>
      <Label width={[1]} p={2}>
        <Text>
          {label}
          <a href={href} target="_blank">
            {href}
          </a>
        </Text>
      </Label>
    </Boxify>
  ),
});

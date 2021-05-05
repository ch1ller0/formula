import { Label, Input, Select, Radio, Checkbox } from '@rebass/forms';
import { Button, Box, Flex, Text as RText } from 'rebass';
import { BaseSyntheticEvent } from 'react';
import { ViewGenerator } from '../../src/generate';

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

const Boxify = (children, error) => {
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

export const InputFieldView = ViewGenerator.field<{ label: string }>({
  name: 'input',
  render: ({ value, setValue, name, props }) => {
    const onChange = (e: BaseSyntheticEvent<{ value: string }>) =>
      setValue(e.target.value);

    return Boxify(
      <>
        {props.label && (
          <Label htmlFor={name}>
            <Text>{props.label}</Text>
          </Label>
        )}
        <Input id={name} name={name} value={value} onChange={onChange} />
      </>,
      props.error,
    );
  },
});

export const SelectFieldView = ViewGenerator.field<{
  label: string;
  options: string[];
}>({
  name: 'select',
  render: ({ value, setValue, props, name }) => {
    const { label, options } = props;
    const onChange = (e: BaseSyntheticEvent<{ value: string }>) =>
      setValue(e.target.value);

    return Boxify(
      <>
        {label && (
          <Label htmlFor={name}>
            <Text>{label}</Text>
          </Label>
        )}
        <Select id={name} name={name} value={value} onChange={onChange}>
          {options.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </Select>
      </>,
      props.error,
    );
  },
});

export const RadioFieldView = ViewGenerator.field<{
  options: { value: string; label: string }[];
  label: string;
}>({
  name: 'radio',
  render: ({ value: selectedValue, setValue, props, name }) => {
    const { label, options } = props;
    const onChange = (e: BaseSyntheticEvent<{ value: string }>) => {
      setValue(e.target.value);
    };

    const renderedOptions = options.map(({ value, label }, index) => (
      <Label width={[1 / 2, 1 / 4]} p={2} key={value}>
        <Radio
          id={value}
          name={name}
          value={value}
          onChange={onChange}
          checked={value === selectedValue || index === 0}
        />
        <Text fontSize={2}>{label}</Text>
      </Label>
    ));

    return Boxify(
      <>
        {label && (
          <Label htmlFor={name}>
            <Text>{label}</Text>
          </Label>
        )}
        <Flex>{renderedOptions}</Flex>
      </>,
      props.error,
    );
  },
});

export const CheckboxFieldView = ViewGenerator.field<{
  label: string;
}>({
  name: 'checkbox',
  render: ({ value, setValue, props, name }) => {
    const { label } = props;
    const onChange = (e: BaseSyntheticEvent<{ value: string }>) => {
      setValue(e.target.checked);
    };

    return Boxify(
      <Label width={[1 / 2]} p={2}>
        <Checkbox id={name} name={name} onChange={onChange} checked={value} />
        <Text fontSize={2}>{label}</Text>
      </Label>,
      props.error,
    );
  },
});

export const SubmitButtonView = ViewGenerator.field<{ label: string }>({
  name: 'submit',
  render: ({ props, onAction }) => {
    const { label, disabled = true } = props;

    return Boxify(
      <Button
        onClick={onAction}
        disabled={disabled}
        bg={disabled && 'disconnect'}
        style={{
          cursor: 'pointer',
        }}
      >
        <Text color={disabled ? 'white' : 'black'}>{label}</Text>
      </Button>,
      props.error,
    );
  },
});

export const ThankYouView = ViewGenerator.field<{
  title: string;
  link: { href: string; label: string };
}>({
  name: 'final-page',
  render: ({ props }) => {
    const {
      title,
      link: { href, label },
    } = props;

    return Boxify(
      <>
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
      </>,
      props.error,
    );
  },
});

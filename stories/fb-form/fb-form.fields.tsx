import { Label, Input, Select, Radio, Checkbox } from '@rebass/forms';
import { Button, Box, Flex, Text as RText } from 'rebass';
import { BaseSyntheticEvent } from 'react';
import { ViewGenerator } from '../../packages/core/src';

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

export const InputFieldView = ViewGenerator.field<{ label: string }>({
  name: 'input',
  render: ({ value = '', setValue, name, label, error }) => {
    const onChange = (
      e: BaseSyntheticEvent<unknown, unknown, { value: string }>,
    ) => setValue(e.target.value);

    return (
      <Boxify error={error}>
        {label && (
          <Label htmlFor={name}>
            <Text>{label}</Text>
          </Label>
        )}
        <Input id={name} name={name} value={value} onChange={onChange} />
      </Boxify>
    );
  },
});

export const SelectFieldView = ViewGenerator.field<{
  label: string;
  options: string[];
  error: string;
}>({
  name: 'select',
  render: ({ value, setValue, label, options, error, name }) => {
    const onChange = (
      e: BaseSyntheticEvent<unknown, unknown, { value: string }>,
    ) => setValue(e.target.value);

    return (
      <Boxify error={error}>
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
  render: ({ value: selectedValue, setValue, label, options, name, error }) => {
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

    return (
      <Boxify error={error}>
        {label && (
          <Label htmlFor={name}>
            <Text>{label}</Text>
          </Label>
        )}
        <Flex>{renderedOptions}</Flex>
      </Boxify>
    );
  },
});

export const CheckboxFieldView = ViewGenerator.field<{
  label: string;
  error: string;
}>({
  name: 'checkbox',
  render: ({ value = false, setValue, name, label, error }) => {
    const onChange = (e: BaseSyntheticEvent<{ value: string }>) => {
      setValue(e.target.checked);
    };

    return (
      <Boxify error={error}>
        <Label width={[1 / 2]} p={2}>
          <Checkbox id={name} name={name} onChange={onChange} checked={value} />
          <Text fontSize={2}>{label}</Text>
        </Label>
      </Boxify>
    );
  },
});

export const SubmitButtonView = ViewGenerator.field<{
  label: string;
  disabled: boolean;
  onAction: () => void;
}>({
  name: 'submit',
  render: ({ onAction, label, disabled = true }) => (
    <Boxify>
      <Button
        onClick={onAction}
        disabled={disabled}
        bg={disabled ? 'disconnect' : 'primary'}
        style={{
          cursor: 'pointer',
        }}
      >
        <Text color={disabled ? 'white' : 'black'}>{label}</Text>
      </Button>
    </Boxify>
  ),
});

export const ThankYouView = ViewGenerator.field<{
  title: string;
  link: { href: string; label: string };
}>({
  name: 'final-page',
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

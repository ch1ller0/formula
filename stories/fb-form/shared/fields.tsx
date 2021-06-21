import {
  Button,
  Input,
  SelectPicker,
  RadioGroup,
  Radio,
  Checkbox,
  FlexboxGrid,
} from 'rsuite';
import { ViewGenerator } from '@formula/core';
import 'rsuite/dist/styles/rsuite-default.css';

const Text: React.FC<
  Partial<{
    fontSize: number;
    color: string;
  }>
> = (props) => (
  <p
    style={{
      fontFamily: 'system-ui',
      fontSize: (props.fontSize || 7) * 3,
      fontWeight: 'normal',
      color: props.color || 'black',
      marginBottom: 6,
    }}
  >
    {props.children}
  </p>
);

const Boxify: React.FC<{ error?: string; name?: string; label?: string }> = ({
  children,
  error,
  label,
  name,
}) => {
  return (
    <>
      <FlexboxGrid justify="start">
        <FlexboxGrid.Item
          colspan={24}
          style={{
            marginTop: 15,
          }}
        >
          {label && name && (
            <label htmlFor={name}>
              <Text>{label}</Text>
            </label>
          )}
          {children}
          {error ? (
            <Text fontSize={5} color="red">
              {error}
            </Text>
          ) : null}
        </FlexboxGrid.Item>
      </FlexboxGrid>
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
      <Boxify error={error} name={name} label={label}>
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
      <Boxify error={error} label={label} name={name}>
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
      <Boxify error={error} label={label} name={name}>
        <RadioGroup
          appearance="default"
          name="radioList"
          inline
          onChange={onChange}
          value={selectedValue}
        >
          {options.map((a) => (
            <Radio key={a.value} value={a.value}>
              <Text fontSize={5}>{a.label}</Text>
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
          <Text fontSize={5}>{label}</Text>
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
      <Text>{title}</Text>
      <Text>
        {label}
        <a href={href} target="_blank">
          {href}
        </a>
      </Text>
    </Boxify>
  ),
});

export const requiredValidator = (v: string) =>
  !v?.length ? 'Field is required' : undefined;

export const lengthValidator = ({
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

export const requiredValidator = (v: string) =>
  !v?.length ? 'Field is required' : undefined;

// Fake promise
export const lengthValidator = ({
  min = 0,
  max = 30,
}: {
  min?: number;
  max?: number;
}) => (v: string) => {
  return new Promise((res) => {
    setTimeout(() => {
      const { length } = v;
      if (length > max || length < min) {
        res(`Length should be between ${min} and ${max}`);
      }
      res(undefined);
    }, 50);
  });
};

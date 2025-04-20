export const validateUserCode = (value: string): boolean => {
  return /^[a-z0-9]*$/.test(value);
};

export const validateUserCode = (value: string): boolean => {
  const blacklist = ['admin', 'poklist', 'list', 'login']; // FUTURE: get from backend
  if (blacklist.some((word) => value.includes(word))) {
    return false;
  }
  return /^[a-z0-9][a-z0-9._]*[a-z0-9]?$/.test(value);
};

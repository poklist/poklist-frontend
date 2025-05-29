export const validateUserCode = (value: string): boolean => {
  const blacklist = ['admin', 'poklist', 'list', 'login']; // FUTURE: get from backend
  if (blacklist.includes(value)) {
    return false;
  }

  if (value.length < 1 || value.length > 30) {
    return false;
  }

  if (
    value.startsWith('.') ||
    value.startsWith('_') ||
    value.endsWith('.') ||
    value.endsWith('_')
  ) {
    return false;
  }

  return /^[a-z0-9._]+$/.test(value);
};

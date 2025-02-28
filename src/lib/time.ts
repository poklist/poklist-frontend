// FUTURE: be aware of the future i18n support
export const getFormattedTime = (inputTime: string | Date, locale: string) => {
  let time: Date;
  if (!(inputTime instanceof Date)) {
    time = new Date(inputTime);
  } else {
    time = inputTime;
  }
  const dateFormat: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
  };
  if (time.getFullYear() !== new Date().getFullYear()) {
    dateFormat.year = 'numeric';
  }
  return time.toLocaleDateString(locale, dateFormat);
};

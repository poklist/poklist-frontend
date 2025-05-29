import moment from 'moment';

// FUTURE: be aware of the future i18n support
export const getFormattedTime = (inputTime: string | Date, locale: string) => {
  let time: Date;
  if (!(inputTime instanceof Date)) {
    time = moment(inputTime, 'YYYY-MM-DD HH:mm:ss.SSSSS Z').toDate();
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

export const parsePostgresDate = (dateStr: string): Date | null => {
  const date = moment(dateStr, 'YYYY-MM-DD HH:mm:ss.SSSSS Z').toDate();
  return isNaN(date.getTime()) ? null : date;
};

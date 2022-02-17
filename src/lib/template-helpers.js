import { format } from 'date-fns';
/**
 * Formats a timestamped date
 * @param {string} datestring
 * @returns formatted date (dd.MM.yyyy)
 */
export function formatDate(str) {
  let date = '';

  try {
    date = format(str || '', 'dd.MM.yyyy');
  } catch {
    return '';
  }

  return date;
}

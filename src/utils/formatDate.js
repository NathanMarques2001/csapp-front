import { format, parseISO } from 'date-fns';

export default function formatDate(inputDate) {
  const date = parseISO(inputDate);
  return format(date, 'yyyy-MM-dd');
}

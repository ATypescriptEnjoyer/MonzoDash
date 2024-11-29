import moment from 'moment';
import { Holiday } from '../holidays/schemas/holidays.schema';

const getLastNonWeekend = (date: moment.Moment): moment.Moment =>
  date.isoWeekday() > 5 ? date.clone().subtract(date.isoWeekday() - 5, 'days') : date.clone();

export const calculatePayDay = async (
  day: number,
  holidays: Holiday[],
  dateNow: Date = new Date(),
  paidOnHolidays = false,
  paidLastWorkingDay = false,
): Promise<Date> => {
  if (paidLastWorkingDay) {
    const possibleLastDay = getLastNonWeekend(moment().endOf('month')).toDate();
    if (possibleLastDay.getDate() === moment().date()) {
      return getLastNonWeekend(moment().set('date', 1).add('1', 'month').endOf('month')).toDate();
    }
  }
  let momentDate = moment(dateNow);
  if (momentDate.date() >= day) momentDate = momentDate.add('1', 'month');
  momentDate.set('date', day);
  if (!paidOnHolidays) {
    const finalWorkingDay = getLastNonWeekend(momentDate);
    const isBankHoliday = holidays.some(({ date }) => finalWorkingDay.isSame(date));
    if (isBankHoliday) {
      if (finalWorkingDay.isoWeekday() <= 5 && finalWorkingDay.isoWeekday() >= 2) {
        finalWorkingDay.subtract('1', 'day');
      } else if (finalWorkingDay.isoWeekday() === 1) {
        finalWorkingDay.subtract('3', 'days');
      }
    }
    return finalWorkingDay.toDate();
  }
  return momentDate.toDate();
};

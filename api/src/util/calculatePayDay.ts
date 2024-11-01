import * as moment from 'moment';
import { Holiday } from '../holidays/schemas/holidays.schema';

const getLastNonWeekend = (date: moment.Moment): moment.Moment => {
  if (date.isoWeekday() === 6) {
    return date.clone().subtract('1', 'day');
  } else if (date.isoWeekday() === 7) {
    return date.clone().subtract('2', 'days');
  }
  return date;
}

export const calculatePayDay = async (day: number, holidays: Holiday[], fromDate: Date = new Date(), paidOnHolidays = false, paidLastWorkingDay = false): Promise<Date> => {
  const dateNow = fromDate;
  let year = dateNow.getFullYear();
  let month = dateNow.getDate() >= day ? dateNow.getMonth() + 2 : dateNow.getMonth() + 1;
  if (month >= 13) {
    month = 1;
    year = year + 1;
  }
  let proposedNextPayday = moment(new Date(`${year}-${month}-${day}`));
  if (paidLastWorkingDay) {
    return getLastNonWeekend(proposedNextPayday.endOf('month')).toDate();
  }
  if (!paidOnHolidays) {
    const finalWorkingDay = getLastNonWeekend(proposedNextPayday);
    const isBankHoliday = holidays.some(({ date }) => finalWorkingDay.isSame(date));
    if (isBankHoliday) {
      if (finalWorkingDay.isoWeekday() <= 5 && finalWorkingDay.isoWeekday() >= 2) {
        finalWorkingDay.subtract('1', 'day');
      } else if (finalWorkingDay.isoWeekday() === 1) {
        finalWorkingDay.subtract('3', 'days');
      }
    }
    proposedNextPayday = finalWorkingDay;
  }
  proposedNextPayday.add('1', 'day');
  return proposedNextPayday.toDate();
};

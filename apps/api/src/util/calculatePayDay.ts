import dayjs from 'dayjs';
import { Holiday } from '../holidays/schemas/holidays.schema';

const getLastNonWeekend = (date: dayjs.Dayjs): dayjs.Dayjs => {
  const day = date.day();
  if (![0, 6].includes(day)) return date;
  return date.subtract(day === 0 ? 2 : 1, 'day');
};

const getLastWorkingDayPaydayDate = () => {
  const possibleLastDay = getLastNonWeekend(dayjs().endOf('month')).toDate();
  if (possibleLastDay.getDate() > dayjs().date()) return possibleLastDay;
  return getLastNonWeekend(dayjs().set('date', 1).add(1, 'month').endOf('month')).toDate();
};

const getPossiblePayday = (dateNow: Date, payday: number) => {
  let date = dayjs(dateNow);
  if (date.date() >= payday) date = date.add(1, 'month');
  return date.set('date', payday);
};

export const calculatePayDay = async (
  day: number,
  holidays: Holiday[],
  dateNow: Date = new Date(),
  paidOnHolidays = false,
  paidLastWorkingDay = false,
): Promise<Date> => {
  if (paidLastWorkingDay) return getLastWorkingDayPaydayDate();
  const payday = getPossiblePayday(dateNow, day);
  if (paidOnHolidays) return payday.toDate();

  const finalWorkingDay = getLastNonWeekend(payday);
  const isBankHoliday = holidays.some(({ date }) => finalWorkingDay.isSame(date));
  if (isBankHoliday) {
    if (finalWorkingDay.day() >= 2 && finalWorkingDay.day() <= 6) {
      finalWorkingDay.subtract(1, 'day');
    } else if (finalWorkingDay.day() === 1) {
      finalWorkingDay.subtract(3, 'day');
    } else {
      finalWorkingDay.subtract(2, 'day');
    }
  }
  return finalWorkingDay.toDate();
};

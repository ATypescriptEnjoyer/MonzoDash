import axios from 'axios';
import * as moment from 'moment';

export const calculatePayDay = async (day: number): Promise<Date> => {
  const dateNow = new Date();
  let year = dateNow.getFullYear();
  let month = dateNow.getDate() >= day ? dateNow.getMonth() + 2 : dateNow.getMonth() + 1;
  if (month >= 13) {
    month = 1;
    year = year + 1;
  }
  const proposedNextPayday = moment(new Date(`${year}-${month}-${day}`));
  if (proposedNextPayday.isoWeekday() === 6) {
    proposedNextPayday.subtract('1', 'day');
  } else if (proposedNextPayday.isoWeekday() === 7) {
    proposedNextPayday.subtract('2', 'days');
  }
  const { data } = await axios.get('https://www.gov.uk/bank-holidays.json');
  const holArr: { date: string }[] = data['england-and-wales']['events'];
  const isBankHoliday = holArr.some(({ date }) => proposedNextPayday.isSame(date));
  if (isBankHoliday) {
    if (proposedNextPayday.isoWeekday() <= 5 && proposedNextPayday.isoWeekday() >= 2) {
      proposedNextPayday.subtract('1', 'day');
    } else if (proposedNextPayday.isoWeekday() === 1) {
      proposedNextPayday.subtract('3', 'days');
    }
  }
  proposedNextPayday.add('1', 'day');
  return proposedNextPayday.toDate();
};

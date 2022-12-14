import moment from 'moment';

export const DateFormate = (date: string) =>
  date ? moment(date).format('lll') : '_';

export const getLastDaysFrom = (date: string) => {
  return moment().diff(moment(date), 'days') < 7
    ? moment(date).fromNow()
    : moment(date).format('ll');
};

export const dateDifferenceInDays = (first: string) => {
  let date1 = moment(first);
  let date2 = moment();
  return date2.diff(date1, 'days');
};

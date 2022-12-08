import moment from 'moment';

export const DateFormate = (date: string) =>
  date ? moment(date).format('lll') : '_';

export const getLastDaysFrom = (date: string) => {
  return moment().diff(moment(date), 'days') < 7
    ? moment(date).fromNow()
    : moment(date).format('ll');
};

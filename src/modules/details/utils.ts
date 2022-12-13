import moment from 'moment';

export const EtaButtonShow = ({
  eta,
  createDate,
}: {
  eta?: string;
  createDate?: string;
}) => {
  if (eta) {
    return moment().diff(moment(eta), 'days') > 0;
  }

  return moment().diff(moment(createDate), 'days') > 2;
};

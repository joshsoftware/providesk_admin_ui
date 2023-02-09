import { get } from 'apis/apiHelper';

export const getAnalyticalReports = () => {
  return get({ path: `/tickets/analytical_reports` });
};

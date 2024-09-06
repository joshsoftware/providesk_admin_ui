import { post, get, put } from 'apis/apiHelper';
import { ICreateTicketPayload } from './type';

export const postCreateTicket = (payload: ICreateTicketPayload) =>
  post({ path: '/tickets', requestParams: payload });

export const getUsersList = (dept_id, org_id?) => {
  if (dept_id === 'unassigned') {
    // to fetch employees who doesn't  belong to any department
    return get({ path: `organizations/${org_id}/users` });
  }
  return get({ path: `/departments/${dept_id}/users` });
};

export const putEditTicket = ({ id, ticket_details: payload }) => {
  return put({ path: `/tickets/${id}`, payloadParams: payload });
};

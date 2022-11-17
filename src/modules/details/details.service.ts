import { get, put } from 'apis/apiHelper';

export const putEditTicket = ({ id, ticket: payload }) => {
  return put({ path: `/tickets/${id}`, payloadParams: payload });
};

export const putReopenTicket = ({ id, ticket_result: payload }) => {
  return put({ path: `/tickets/${id}/reopen`, payloadParams: payload });
};

export const getDetailsTicket = (id) => {
  return get({
    path: `/tickets/${id}`,
  });
};

export const getDepartmentList = () => {
  return get({ path: `/organizations/1/departments` });
};

export const getCategoryList = () => {
  return get({ path: `/category/` });
};

import { get, put } from 'apis/apiHelper';

export const putProgressTicket = ({ id, ticket_details: payload }) => {
  return put({
    path: `/tickets/${id}/update_ticket_progress`,
    payloadParams: payload,
  });
};

export const putReopenTicket = ({ id, ticket_result: payload }) => {
  return put({ path: `/tickets/${id}/reopen`, payloadParams: payload });
};

export const getDetailsTicket = (id) => {
  return get({
    path: `/tickets/${id}`,
  });
};

export const getAskForUpdate = (id: number, pathTicket: string) => {
  return get({
    path: `/tickets/${id}/ask_for_update/?ticket_link=${pathTicket}`,
  });
};

import { put } from 'apis/apiHelper';

export const putEditUser = (id, payload) =>
  put({ path: `/users/${id}`, payloadParams: payload });

import { post } from 'apis/apiHelper';

export const login = (loginPayload) => {
  return post({
    path: '/sessions',
    requestParams: loginPayload,
    requireToken: false,
  });
};

import { get, post } from 'apis/apiHelper';
import { createOrganizationPayloadType } from './type';

export const postCreateOrganization = ({
  payload,
}: {
  payload: createOrganizationPayloadType;
}) => {
  return post({ path: '/organizations', requestParams: payload });
};

export const getOrganization = () => {
  return get({ path: '/organizations' });
};

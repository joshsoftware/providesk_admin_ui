import { post } from 'apis/apiHelper';
import { createOrganizationPayloadType } from './type';

export const postCreateOrganization = ({
  payload,
}: {
  payload: createOrganizationPayloadType;
}) => {
  return post({ path: '/organizations', requestParams: payload });
};

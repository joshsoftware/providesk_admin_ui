import { post } from 'apis/apiHelper';

export const postCreateDepartment = ({
  payload,
}: {
  payload: { name: string; id: number };
}) => {
  return post({ path: '/departments', requestParams: payload });
};

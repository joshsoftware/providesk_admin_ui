import { get, post } from 'apis/apiHelper';
import { IreateCategoryPayload } from './type';

export const postCreateCategory = ({
  payload,
}: {
  payload: IreateCategoryPayload;
}) => {
  return post({ path: '/categories', requestParams: payload });
};

export const getDepartmentList = (org_id) => {
  return get({ path: `organizations/${org_id}/departments` });
};

export const getCategoriesList = (dept_id) => {
  return get({ path: `/departments/${dept_id}/categories` });
};

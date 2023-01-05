import { ROLES } from 'routes/roleConstants';

export const getAllowedRoles = (role) => {
  let allowedRoles;
  if (role === ROLES.ADMIN) {
    allowedRoles = ['Employee', 'Department_Head', 'Admin', 'Resolver'];
  } else if (role === ROLES.DEPARTMENT_HEAD) {
    allowedRoles = ['Employee', 'Department_Head', 'Resolver'];
  } else {
    allowedRoles = ['Employee'];
  }
  return allowedRoles;
};

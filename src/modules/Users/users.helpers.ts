import { ROLES } from 'routes/roleConstants';

export const getAllowedRoles = (role) => {
  let allowedRoles;
  if (role === ROLES.ADMIN) {
    allowedRoles = ['Employee', 'Department Head', 'Admin'];
  } else {
    allowedRoles = ['Employee'];
  }
  return allowedRoles;
};

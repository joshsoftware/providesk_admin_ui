import React, { useContext } from 'react';

import { UserContext } from 'App';
import ROUTE from 'routes/constants';

interface IProps {
  Component: JSX.Element;
  AllowedRoles: string[];
}

const PrivateRoute: React.FC<IProps> = ({ Component, AllowedRoles }) => {
  const userContext = useContext(UserContext);
  const auth = userContext.userAuth;

  // redirect user to login page if token not present
  if (!auth?.auth_token) {
    window.location.href = ROUTE.LOGIN;
    return null;
  }

  //check if user has valid role to access the component
  if (!auth.role || !AllowedRoles.includes(auth.role)) {
    window.location.href = ROUTE.UNAUTHORIZED;
    return null;
  }

  return Component;
};

export default PrivateRoute;

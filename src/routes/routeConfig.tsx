import { Navigate } from 'react-router-dom';

import { Organization } from 'modules/Organization';
import { DepartMent } from 'modules/Department';
import { Category } from 'modules/Category';
import AuthContainer from 'modules/Auth';
import Dashboard from 'modules/dashboard';
import PrivateRoute from 'modules/shared/HOC/privateRoute';

// import Details from 'modules/details';
import UnauthorizedAccess from 'modules/Auth/components/UnauthorizedAccess';
import withLayout from 'layouts';
import { ROLES } from './roleConstants';
import ROUTE from './constants';
import { Users } from 'modules/Users';
import { lazy, Suspense } from 'react';
import Loader from 'modules/Auth/components/Loader';

const Details = lazy(() => import('modules/details'));
const Ticket = lazy(() => import('modules/Ticket'));

export const routeConfig = [
  {
    path: ROUTE.ROOT,
    element: <Navigate to='/login' replace={true} />,
  },
  {
    path: ROUTE.LOGIN,
    element: <AuthContainer />,
  },
  {
    path: ROUTE.UNAUTHORIZED,
    element: withLayout(<UnauthorizedAccess />),
  },
  {
    path: ROUTE.DASHBOARD,
    element: (
      <PrivateRoute
        Component={withLayout(<Dashboard />)}
        AllowedRoles={[ROLES.ADMIN, ROLES.DEPARTMENT_HEAD, ROLES.EMPLOYEE]}
      />
    ),
  },
  {
    path: ROUTE.DETAILS,
    element: (
      <PrivateRoute
        Component={withLayout(
          <Suspense fallback={<Loader isLoading={true} />}>
            <Details />
          </Suspense>
        )}
        AllowedRoles={[ROLES.ADMIN, ROLES.DEPARTMENT_HEAD, ROLES.EMPLOYEE]}
      />
    ),
  },
  {
    path: ROUTE.ORGANIZATION,
    element: (
      <PrivateRoute
        Component={withLayout(<Organization />)}
        AllowedRoles={[ROLES.SUPER_ADMIN]}
      />
    ),
  },
  {
    path: ROUTE.DEPARTMENT,
    element: (
      <PrivateRoute
        Component={withLayout(<DepartMent />)}
        AllowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}
      />
    ),
  },
  {
    path: ROUTE.CATEGORY,
    element: (
      <PrivateRoute
        Component={withLayout(<Category />)}
        AllowedRoles={[ROLES.ADMIN, ROLES.DEPARTMENT_HEAD]}
      />
    ),
  },
  {
    path: ROUTE.USERS,
    element: (
      <PrivateRoute
        Component={withLayout(<Users />)}
        AllowedRoles={[ROLES.ADMIN, ROLES.DEPARTMENT_HEAD]}
      />
    ),
  },
  {
    path: ROUTE.TICKET,
    element: (
      <PrivateRoute
        Component={withLayout(
          <Suspense fallback={<Loader isLoading={true} />}>
            <Ticket />
          </Suspense>
        )}
        AllowedRoles={[ROLES.ADMIN, ROLES.DEPARTMENT_HEAD, ROLES.EMPLOYEE]}
      />
    ),
  },
];

import ROUTE from 'routes/constants';
import { ROLES } from 'routes/roleConstants';

import DashboardIcon from '@mui/icons-material/Dashboard';
import DomainIcon from '@mui/icons-material/Domain';
import CategoryIcon from '@mui/icons-material/Category';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import GroupIcon from '@mui/icons-material/Group';

export const getSidebarConfig = (role: string) => {
  const employeeAccessSidebar = [
    {
      label: 'Dashboard',
      icon: <DashboardIcon fontSize='small' />,
      path: ROUTE.DASHBOARD,
    },
  ];

  const adminAccessSidebar = [
    ...employeeAccessSidebar,
    {
      label: 'Departments',
      icon: <DomainIcon fontSize='small' />,
      path: ROUTE.DEPARTMENT,
    },
    {
      label: 'Categories',
      icon: <CategoryIcon fontSize='small' />,
      path: ROUTE.CATEGORY,
    },
    {
      label: 'Employees',
      icon: <GroupIcon fontSize='small' />,
      path: ROUTE.USERS,
    },
    { label: 'Reports', path: ROUTE.REPORTS, icon: <TimelineRoundedIcon /> },
  ];

  const superAdminAccessSidebar = [
    {
      label: 'Organizations',
      icon: <ApartmentIcon fontSize='small' />,
      path: ROUTE.ORGANIZATION,
    },
  ];

  const departmentHeadAccessSidebar = [
    ...employeeAccessSidebar,
    {
      label: 'Categories',
      icon: <CategoryIcon fontSize='small' />,
      path: ROUTE.CATEGORY,
    },
    {
      label: 'Employees',
      icon: <GroupIcon fontSize='small' />,
      path: ROUTE.USERS,
    },
    { label: 'Reports', path: ROUTE.REPORTS, icon: <TimelineRoundedIcon /> },
  ];

  switch (role) {
    case ROLES.SUPER_ADMIN:
      return superAdminAccessSidebar;
    case ROLES.ADMIN:
      return adminAccessSidebar;
    case ROLES.DEPARTMENT_HEAD:
      return departmentHeadAccessSidebar;
    case ROLES.EMPLOYEE:
      return employeeAccessSidebar;
    default:
      return [];
  }
};

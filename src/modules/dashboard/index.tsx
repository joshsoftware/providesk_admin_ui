import React, { useContext, useEffect, useMemo, useState } from 'react';

import TablePagination from '@mui/material/TablePagination';
import {
  Box,
  Card,
  CardContent,
  Paper,
} from '@mui/material';

import { useGetRequestsList } from './dashboard.hooks';
import Select, { CustomSelect } from 'modules/shared/Select';
import Search from 'modules/shared/Search';
import ComplaintCard from 'modules/shared/ComplaintCard';
import { UserContext } from 'App';
import { useCategories, useDepartments } from 'modules/Category/category.hook';

import { Checkbox, Typography } from '@mui/material';
import './dashboard.scss';
import Loader from 'modules/Auth/components/Loader';
import { Button } from 'modules/shared/Button';
import { AddRounded, RestartAltRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ROUTE from 'routes/constants';
import { ROLES } from 'routes/roleConstants';
import { useUsers } from 'modules/Ticket/ticket.hook';
import { PaginationContext } from 'App';

const statusOptions = [
  {
    value: 'reopen',
    label: 'Reopen',
  },
  {
    value: 'assigned',
    label: 'Assigned',
  },
  {
    value: 'inprogress',
    label: 'In Progress',
  },
  {
    value: 'for_approval',
    label: 'For Approval',
  },
  {
    value: 'closed',
    label: 'Closed',
  },
];

const typeOption = [
  { value: 'complaint', label: 'Complaint' },
  { value: 'request', label: 'Request' },
];

const DEFAULT_FILTERS = {
  status: '',
  type: '',
  department: '',
  title: '',
  category: '',
  page: 0,
  perPage: 30,
  assig_to_me: false,
  created_by_me: false,
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { data, isLoading } = useGetRequestsList(filters);
  const { userAuth } = useContext(UserContext);
  const [page, setPage] = React.useState(0);
  const {rowsPerPage, setRowsPerPage} = useContext(PaginationContext);
  const [departmentId, setDepartmentId] = useState<number>(1);
  const [organizationId, setOrganizationId] = useState<number>(
    userAuth?.organizations?.[0]?.id
  );
  const [resolverEmpId, setResolverEmpId] = useState<string | undefined>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((p) => ({ ...p, [event.target.name]: event.target.value }));
  };

  const onSearchTile = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((p) => ({ ...p, title: event.target.value }));
  };

  useEffect(() => {
    if (userAuth.role === ROLES.DEPARTMENT_HEAD) {
      setFilters((p) => ({
        ...p,
        department: userAuth?.organizations?.[0]?.department_id + '',
      }));
      setDepartmentId(userAuth?.organizations?.[0]?.department_id);
    }
    setOrganizationId(userAuth?.organizations?.[0]?.id);
  }, [userAuth]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const { data: categoriesList, isLoading: listFetching } =
    useCategories(departmentId);
  const categoryOptions = useMemo(() => {
    return (
      categoriesList?.map((cate) => ({
        label: cate.name,
        value: cate.id,
      })) || []
    );
  }, [categoriesList]);

  const { data: departmentsList, isLoading: departmentsFetching } =
    useDepartments(organizationId);

  const deptOptions = useMemo(() => {
    return (
      departmentsList?.map((dept) => ({
        label: dept.name,
        value: dept.id,
      })) || []
    );
  }, [departmentsList]);

  const updatedListdataSearchfilter = useMemo(() => {
    if (filters.title.length > 0) {
      return data?.filter((item) =>
        item.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }
    return data;
  }, [data, filters.title]);

  //add resolver userFilter on Frontend
  const updatedListResolverEmployeeFilter = useMemo(() => {
    if (resolverEmpId)
      return updatedListdataSearchfilter?.filter(
        (item) => item.resolver_id == resolverEmpId
      );
    return updatedListdataSearchfilter;
  }, [updatedListdataSearchfilter, resolverEmpId]);

  const updatedDataFinalList = updatedListResolverEmployeeFilter?.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  const { data: usersList, isLoading: isFetchingUsers } =
    useUsers(departmentId);
  const userResolverList = useMemo(() => {
    const list =
      usersList?.map((emp) => {
        return {
          label: emp.name,
          value: emp.id + '',
        };
      }) || [];
    return [{ label: 'None', value: '' }, ...list];
  }, [usersList]);

  const onClickPlus = () => {
    navigate(ROUTE.TICKET);
  };

  const onClickCreate =() => {
    navigate("/ticket")
  }

  return (
    <Box display='flex' flexDirection='column' flex='1' gap={3} p={3}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant='h5'>Dashboard</Typography>
        <Button
          variant='text'
          onClick={onClickCreate}
          size='small'
          startIcon={<AddRounded sx={{ color: 'primary.main' }} />}
          sx={{ color: 'grey.900', ml: 'auto' }}
        >
          Create Ticket
        </Button>
      </Box>
        <Card sx={{ display: 'flex', flex: 1 }}>
        <CardContent
          sx={{ display: 'flex', flexDirection: 'column', flex: '1' }}
        >
          <Box
            sx={{ display: 'flex', flex: '1', gap: 3 }}
            className='complaint-grid-wrapper'
          >
          {userAuth.role !== 'employee' && ( <Paper
              elevation={0}
              sx={{ display: 'grid', alignSelf: 'flex-start' }}
              className='complaint-filters'
            >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant='h6' sx={{ m: 0 }}>
                  Filter By
                </Typography>
                <Button
                  variant='text'
                  size='small'
                  startIcon={<RestartAltRounded />}
                  onClick={() => {
                    setFilters(DEFAULT_FILTERS);
                    setResolverEmpId('');
                  }}
                  sx={{
                    height: 'auto',
                    color: 'primary.dark',
                    p: 0,
                    ml: 'auto',
                  }}
                >
                  Reset All
                </Button>
              </Box>
              <Box
                sx={{ display: 'grid', gap: '1rem' }}
                className='filter-input-group flex-1'
              >
               
               <CustomSelect
                  label={'Status'}
                  options={statusOptions}
                  value={filters.status}
                  onChange={handleChange}
                  name='status'
                />
                {(userAuth.role === 'admin' ||
                  userAuth.role === 'super_admin') && (
                  <CustomSelect
                    label={'Departments'}
                    options={deptOptions}
                    value={filters.department}
                    onChange={(e) => {
                      setDepartmentId(
                        departmentsList.filter(
                          (item) => item.id === e.target.value
                        )[0].id
                      );

                      setFilters((p) => ({ ...p, category: '' }));
                      setResolverEmpId('');
                      handleChange(e);
                    }}
                    name='department'
                    />
                    )}
                    <Select
                      label={'Resolver Employee'}
                      options={userResolverList}
                      value={resolverEmpId + ''}
                      onChange={(e) => {
                        setResolverEmpId(e.target.value);
                      }}
                      name='resolver_Employee'
                      disabled={filters.department == ''}
                    />
                    <CustomSelect
                      label={'Category'}
                      options={categoryOptions}
                      value={filters.category}
                      onChange={handleChange}
                      name='category'
                    />
                <Search
                  label={'Search'}
                  value={filters.title}
                  onChange={onSearchTile}
                  name='title'
                  placeholder='Enter Title'
                />
                  <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '4px',
                    border: '1px solid',
                    borderColor: 'grey.400',
                  }}
                >
                  <Checkbox
                    checked={filters.assig_to_me}
                    onChange={() =>
                      setFilters((p) => ({
                        ...p,
                        assig_to_me: !filters.assig_to_me,
                      }))
                    }
                    sx={{ p: 2, '& .MuiSvgIcon-root': { fontSize: 20 } }}
                  />
                  <Typography>Assigned to me</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '4px',
                    border: '1px solid',
                    borderColor: 'grey.400',
                  }}
                >
                  <Checkbox
                    checked={filters.created_by_me}
                    onChange={() =>
                      setFilters((p) => ({
                        ...p,
                        created_by_me: !filters.created_by_me,
                      }))
                    }
                    sx={{ p: 2, '& .MuiSvgIcon-root': { fontSize: 20 } }}
                  />
                  <Typography>Created by me</Typography>
                </Box>
              </Box>
            </Paper>)}
            <Box
              sx={{
                borderWidth: 0,
                borderStyle: 'solid',
                borderColor: 'grey.300',
              }}
              className='divider -vertical'
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
              {isLoading ? (
                <Loader isLoading={isLoading} />
              ) : updatedDataFinalList?.length === 0 ? (
                <Typography variant='h6' sx={{ p: 3, textAlign: 'center' }}>
                  No Ticket
                </Typography>
              ) : (
                <Box
                  sx={{ display: 'grid', gap: '1rem' }}
                  className='complaint-card-grid'
                >
                  {updatedDataFinalList?.map((complaint) => (
                    <ComplaintCard details={complaint} />
                  ))}
                </Box>
              )}
              <TablePagination
                component='div'
                rowsPerPageOptions={[8, 16, 32, 64, 128]}
                count={updatedListResolverEmployeeFilter?.length || 0}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ fontSize: '0.75rem', mt: 'auto' }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;

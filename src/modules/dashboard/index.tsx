import React, { useContext, useEffect, useMemo, useState } from 'react';

import TablePagination from '@mui/material/TablePagination';
import { Box, Card, CardContent, Paper } from '@mui/material';

import { useGetRequestsList } from './dashboard.hooks';
import { CustomSelect } from 'modules/shared/Select';
import Search from 'modules/shared/Search';
import ComplaintCard from 'modules/shared/ComplaintCard';
import { UserContext } from 'App';
import { useCategories, useDepartments } from 'modules/Category/category.hook';

import { Checkbox, Typography } from '@mui/material';
import './dashboard.scss';
// import { useNavigate } from 'react-router-dom';
import Loader from 'modules/Auth/components/Loader';
import { Button } from 'modules/shared/Button';
import { RestartAltRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ROUTE from 'routes/constants';
import { ROLES } from 'routes/roleConstants';

const statusOptions = [
  {
    value: 'reopen',
    label: 'reopen',
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
    value: 'resolved',
    label: 'Resolved',
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
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const [departmentId, setDepartmentId] = useState<number>(1);

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
    useDepartments(1);
  console.log(departmentsList, 'list');
  const deptOptions = useMemo(() => {
    return (
      departmentsList?.map((dept) => ({
        label: dept.name,
        value: dept.id,
      })) || []
    );
  }, [departmentsList]);

  const updatedData = data?.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const updateddataSearch = useMemo(() => {
    if (filters.title.length > 0) {
      return updatedData.filter((item) =>
        item.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }
    return updatedData;
  }, [updatedData, filters.title]);

  const onClickPlus = () => {
    navigate(ROUTE.TICKET);
  };
  return (
    <Box
      sx={{ display: 'flex', flex: '1', gap: 3, p: '1rem' }}
      className='complaint-grid-wrapper'
    >
      <Paper
        sx={{ display: 'grid', alignSelf: 'flex-start', p: 3 }}
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
            onClick={() => setFilters(DEFAULT_FILTERS)}
            sx={{ height: 'auto', color: 'primary.dark', p: 0, ml: 'auto' }}
          >
            Reset All
          </Button>
        </Box>
        <Box
          sx={{ display: 'grid', gap: '1rem' }}
          className='filter-input-group flex-1'
        >
          {userAuth.role !== 'employee' && (
            <>
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
                  label={'departments'}
                  options={deptOptions}
                  value={filters.department}
                  onChange={(e) => {
                    setDepartmentId(
                      departmentsList.filter(
                        (item) => item.id === e.target.value
                      )[0].id
                    );

                    setFilters((p) => ({ ...p, category: '' }));
                    handleChange(e);
                  }}
                  name='department'
                />
              )}
              <CustomSelect
                label={'Category'}
                options={categoryOptions}
                value={filters.category}
                onChange={handleChange}
                name='category'
              />
            </>
          )}
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
                setFilters((p) => ({ ...p, assig_to_me: !filters.assig_to_me }))
              }
              sx={{ p: 2, '& .MuiSvgIcon-root': { fontSize: 20 } }}
            />
            <Typography>Assign to me</Typography>
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
      </Paper>
      <Box
        sx={{ borderWidth: 0, borderStyle: 'solid', borderColor: 'grey.300' }}
        className='divider -vertical'
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
        {isLoading ? (
          <Loader isLoading={isLoading} />
        ) : updateddataSearch?.length === 0 ? (
          <Typography variant='h6' sx={{ p: 3, textAlign: 'center' }}>
            No Data
          </Typography>
        ) : (
          <Box
            sx={{ display: 'grid', gap: '1rem' }}
            className='complaint-card-grid'
          >
            {updateddataSearch?.map((complaint) => (
              <ComplaintCard details={complaint} />
            ))}
          </Box>
        )}
        <TablePagination
          component='div'
          rowsPerPageOptions={[8, 16, 32, 64, 128]}
          count={data?.length || 0}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ fontSize: '0.75rem', mt: 'auto' }}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;

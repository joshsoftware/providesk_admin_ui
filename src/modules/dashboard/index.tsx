import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TablePagination from '@mui/material/TablePagination';
import { Box } from '@mui/material';

import { useGetRequestsList } from './dashboard.hooks';
import { CustomSelect } from 'modules/shared/Select';
import Search from 'modules/shared/Search';
import ComplaintCard from 'modules/shared/ComplaintCard';
import './dashboard.scss';

const statusOptions = [
  {
    value: 'open',
    label: 'Open',
  },
  {
    value: 'assigned',
    label: 'Assigned',
  },
  {
    value: 'in_progress',
    label: 'In Progress',
  },
  {
    value: 'resloved',
    label: 'Resloved',
  },
];

const departmentOptions = [
  {
    value: 'finance',
    label: 'Finance',
  },
  {
    value: 'admin',
    label: 'Admin',
  },
  {
    value: 'sales',
    label: 'Sales',
  },
  {
    value: 'learning',
    label: 'Learning',
  },
];

const DEFAULT_FILTERS = {
  status: '',
  department: '',
  title: '',
  page: 0,
  perPage: 30,
};

const TOTAL_COMPLAINTS = 15;

const Dashboard = () => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { data, isLoading } = useGetRequestsList(filters);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((p) => ({ ...p, [event.target.name]: event.target.value }));
  };

  const onSearchTile = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((p) => ({ ...p, title: event.target.value }));
  };

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

  const updatedData = data?.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <Box sx={{display: 'flex', flexDirection: 'column'}}>
      <Box sx={{display: 'flex', gap: '1.5rem', mb: '1.5rem'}} className='complaint-card-filters'>
        <Box sx={{display: 'grid', gap: '1.5rem'}} className='filter-input-group flex-1'>
          <CustomSelect
            label={'Status'}
            options={statusOptions}
            value={filters.status}
            onChange={handleChange}
            name='status'
          />
          <CustomSelect
            label={'Departments'}
            options={departmentOptions}
            value={filters.department}
            onChange={handleChange}
            name='deparment'
          />
          <Search
            label={'Enter Title'}
            value={filters.title}
            onChange={onSearchTile}
            name='title'
          />
        </Box>
        <Button variant='contained' size='small'>
          Search
        </Button>
      </Box>
      <Box sx={{display: 'grid', gap: '1.5rem'}} className='complaint-card-grid'>
        {updatedData?.map((complaint) => (
          <ComplaintCard details={complaint} />
        ))}
      </Box>
      <TablePagination
        component='div'
        count={TOTAL_COMPLAINTS}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{fontSize: '0.75rem'}}
      />
    </Box>
  );
};

export default Dashboard;

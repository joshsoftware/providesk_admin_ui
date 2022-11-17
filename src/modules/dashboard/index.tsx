import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TablePagination from '@mui/material/TablePagination';

import { useGetRequestsList } from './dashboard.hooks';
import { CustomSelect } from 'modules/shared/Select';
import Search from 'modules/shared/Search';
import ComplaintCard from 'modules/shared/ComplaintCard';

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
    <div>
      <div className='d-flex flex-column p-5 '>
        <div className='d-flex gap-3 mb-4'>
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
          <Button variant='contained' sx={{ width: 250 }}>
            Search
          </Button>
        </div>
        <div className='d-flex justify-content-around flex-wrap gap-4 mt-3'>
          {updatedData?.map((complaint) => (
            <ComplaintCard details={complaint} />
          ))}
        </div>
        <div className='d-flex justify-content-end mt-3'>
          <TablePagination
            component='div'
            count={TOTAL_COMPLAINTS}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ alignItems: 'center', fontWeight: 'bold', fontSize: 30 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

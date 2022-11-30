import { useCallback, useContext, useMemo, useState } from 'react';

import Select from 'modules/shared/Select';
import Loader from 'modules/Auth/components/Loader';
import { UserContext } from 'App';
import { useCategories, useDepartments } from '../category.hook';

import {
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Typography,
  TableHead,
  TableRow,
} from '@mui/material';

const CategoryList = () => {
  const { userAuth } = useContext(UserContext);

  const [organizationId, setOrganizationId] = useState<number | ''>(
    userAuth?.organizations?.[0]?.id || ''
  );

  const { data: departmentsList, isLoading: isFetchingDepartment } =
    useDepartments(organizationId);

  const [departmentId, setDepartmentId] = useState<number | ''>(
    departmentsList?.[0]?.id || ''
  );

  const { data: categoriesList, isLoading: isFetchingCategories } =
    useCategories(departmentId);

  const deptOptions = useMemo(() => {
    return (
      departmentsList?.map((dept) => ({
        label: dept.name,
        value: dept.id,
      })) || []
    );
  }, [departmentId, departmentsList]);

  const handleChange = useCallback((value: string) => {
    setDepartmentId(parseInt(value));
  }, []);

  return (
    <div
      style={{
        width: '80%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        margin: '1rem',
        alignItems: 'center',
      }}
    >
      <Loader isLoading={isFetchingDepartment || isFetchingCategories} />
      <Divider>
        <Typography variant='h4' component='div' align='center'>
          Category Listing
        </Typography>
      </Divider>
      <div style={{ margin: '12px 0' }}>
        <Select
          required={true}
          sx={{ m: 0, width: '12rem' }}
          label={'Department'}
          value={departmentId}
          options={deptOptions}
          onChange={(e) => handleChange(e.target.value)}
        />{' '}
        <br />
      </div>
      <TableContainer
        component={Paper}
        style={{
          maxHeight: '45vh',
          overflowY: 'auto',
          width: '60%',
          minWidth: '280px',
        }}
      >
        {categoriesList ? (
          <Table
            stickyHeader={true}
            sx={{
              minWidth: 250,
              maxHeight: '20vh',
              overflow: 'scroll',
            }}
            aria-label='sticky table'
          >
            <TableHead>
              <TableRow>
                <TableCell
                  component='th'
                  scope='span'
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    maxWidth: '1rem',
                  }}
                >
                  Id
                </TableCell>
                <TableCell sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                  Name
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categoriesList?.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p style={{ textAlign: 'center' }}>
            {!departmentId && 'Select Department to few categories'}
          </p>
        )}
      </TableContainer>
    </div>
  );
};

export default CategoryList;

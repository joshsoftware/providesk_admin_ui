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
  Box,
  Grid,
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
    <>
      <Loader isLoading={isFetchingDepartment || isFetchingCategories} />
      <Grid container sx={{mb: 3}}>
        <Grid xs md={4}>
          <Select
            required={true}
            label={'Department'}
            value={departmentId}
            options={deptOptions}
            onChange={(e) => handleChange(e.target.value)}
          />
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        {categoriesList ? (
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'primary.main', fontWeight: '700' }}>Id</TableCell>
                <TableCell sx={{ color: 'primary.main', fontWeight: '700' }}>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categoriesList?.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    <Typography>{row.id}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{row.name}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography variant='h6' sx={{ p: 3, textAlign: "center" }}>
            {!departmentId && 'Select Department to view categories'}
          </Typography>
        )}
      </TableContainer>
    </>
  );
};

export default CategoryList;

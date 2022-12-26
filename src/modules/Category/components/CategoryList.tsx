import { useCallback, useContext, useMemo, useState } from 'react';

import Select from 'shared/Select';
import Loader from 'shared/Loader';
import { UserContext } from 'App';
import { useCategories, useDepartments } from '../category.hook';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Typography,
  TableHead,
  TableRow,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { ROLES } from 'routes/roleConstants';

const CategoryList = () => {
  const { userAuth } = useContext(UserContext);

  const [organizationId, setOrganizationId] = useState<number>(
    userAuth?.organizations?.[0]?.id
  );

  const { data: departmentsList, isLoading: isFetchingDepartment } =
    useDepartments(organizationId);

  const [departmentId, setDepartmentId] = useState<number | string>(
    userAuth?.organizations?.[0]?.department_id || 1
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
    <Card>
      <CardContent>
        <Loader isLoading={isFetchingDepartment || isFetchingCategories} />
        <Grid container justifyContent='center' sx={{ mb: 3 }}>
          <Grid xs md={4}>
            <Select
              required={true}
              label={'Department'}
              value={departmentId?.toString()}
              options={deptOptions}
              disabled={userAuth.role === ROLES.DEPARTMENT_HEAD}
              onChange={(e) => handleChange(e.target.value)}
            />
          </Grid>
        </Grid>
        <TableContainer component={Paper} variant='outlined'>
          {categoriesList ? (
            <Table size='small'>
              <TableHead sx={{ backgroundColor: 'grey.100' }}>
                <TableRow>
                  <TableCell sx={{ color: 'primary.main', fontWeight: '500' }}>
                    Id
                  </TableCell>
                  <TableCell sx={{ color: 'primary.main', fontWeight: '500' }}>
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
            <Typography variant='h6' sx={{ p: 3, textAlign: 'center' }}>
              {!departmentId && 'Select Department to view categories'}
            </Typography>
          )}
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default CategoryList;

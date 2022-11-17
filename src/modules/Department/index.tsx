import * as React from 'react';

import { useDepartments } from 'modules/Category/category.hook';
import { UserContext } from 'App';
import { useCreateDepartment } from './department.hook';
import { Button } from 'modules/shared/Button';
import Loader from 'modules/Auth/components/Loader';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, TextField, Typography } from '@mui/material';

export const DepartMent = () => {
  const { userAuth } = React.useContext(UserContext);

  const [organizationId, setOrganizationId] = React.useState<number | ''>(
    userAuth?.organizations?.[0]?.id || ''
  );
  const [department, setDepartment] = React.useState<string>('');

  const { data: departmentsList, isLoading } = useDepartments(organizationId);
  const { mutate, isLoading: creatingDepartment } = useCreateDepartment();

  const createDepartment = React.useCallback(() => {
    const payload = { name: department, organization_id: organizationId };
    mutate(payload);
  }, [mutate, department]);

  const handleChange = (e) => setDepartment(e.target.value);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          m: 1,
        }}
      >
        <Box sx={{ m: 5, display: 'flex', alignItems: 'center' }}>
          <TextField
            label='Add new Department'
            value={department}
            type='text'
            required={true}
            variant='standard'
            color='secondary'
            onChange={handleChange}
          />
          <Button
            isLoading={creatingDepartment}
            onClick={() => createDepartment()}
            className='btn btn-success mx-3'
            style={{ height: '40px' }}
            disabled={department.length < 6}
          >
            Save
          </Button>
        </Box>
        <Box sx={{ width: '600px', maxHeight: '60vh', overflowY: 'scroll' }}>
          {isLoading ? (
            <Loader isLoading={isLoading} />
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 250 }} aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell className='fw-bold'>Id</TableCell>
                    <TableCell className='fw-bold'>Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {departmentsList.map((dept) => (
                    <TableRow
                      key={dept.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component='th' scope='row'>
                        <Typography>{dept.id}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{dept.name}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
    </>
  );
};

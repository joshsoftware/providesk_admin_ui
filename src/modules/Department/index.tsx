import * as React from 'react';

import { useCreateDepartment } from './department.hook';
import { Button } from 'modules/shared/Button';
import Loader from 'modules/Auth/components/Loader';
import { useDepartments } from 'modules/Category/category.hook';
import { UserContext } from 'App';
import { ROLES } from 'routes/roleConstants';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select as SelectMUI,
  TextField,
  Typography,
} from '@mui/material';

export const DepartMent = () => {
  const { userAuth } = React.useContext(UserContext);

  const [organizationId, setOrganizationId] = React.useState<number | ''>(
    userAuth?.organizations?.[0]?.id || ''
  );
  const [department, setDepartment] = React.useState<string>('');

  const { data: departmentsList, isLoading } = useDepartments(organizationId);
  const { mutate, isLoading: creatingDepartment } = useCreateDepartment();

  const createDepartment = React.useCallback(() => {
    const payload = {
      name: department.trim(),
      organization_id: organizationId,
    };
    mutate(payload);
    setDepartment('');
  }, [mutate, department]);

  const handleDepartmentChange = (e) => setDepartment(e.target.value);
  const handleOrganizationChange = (e) => setOrganizationId(e.target.value);

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
        <Paper elevation={2} sx={{ padding: 3, minWidth: '20rem', mb: 5 }}>
          <Typography variant='h5' sx={{ mt: 1, textAlign: 'center' }}>
            Create Department
          </Typography>

          <Box
            sx={{
              m: 5,
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {userAuth?.role === ROLES.SUPER_ADMIN && (
              <FormControl variant='standard' sx={{ m: 2, minWidth: 120 }}>
                <InputLabel id='select-organization'>Organization</InputLabel>
                <SelectMUI
                  labelId='select-organization'
                  id='select-organization'
                  value={organizationId}
                  onChange={handleOrganizationChange}
                  label='Organization'
                >
                  {userAuth?.organizations?.map((org) => (
                    <MenuItem value={org.id}>{org.name}</MenuItem>
                  ))}
                </SelectMUI>
              </FormControl>
            )}

            <TextField
              sx={{ m: 2 }}
              label='Department'
              value={department}
              type='text'
              required={true}
              variant='standard'
              onChange={handleDepartmentChange}
            />
            <Button
              isLoading={creatingDepartment}
              onClick={() => createDepartment()}
              style={{ height: '40px' }}
              disabled={!!organizationId && department.length < 2}
            >
              Create
            </Button>
          </Box>
        </Paper>
        <Box
          sx={{
            width: '100%',
            maxHeight: '60vh',
            maxWidth: '600px',
          }}
        >
          <Typography variant='h5' sx={{ mb: 4, textAlign: 'center' }}>
            Departments List
          </Typography>
          {isLoading ? (
            <Loader isLoading={isLoading} />
          ) : (
            <TableContainer component={Paper}>
              <Table
                sx={{
                  minWidth: 250,
                  maxHeight: '20vh',
                  overflow: 'scroll',
                }}
                aria-label='simple table'
              >
                <TableHead>
                  <TableRow>
                    <TableCell className='fw-bold'>Id</TableCell>
                    <TableCell className='fw-bold'>Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {departmentsList?.map((dept) => (
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

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
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select as SelectMUI,
  TextField,
  Typography,
} from '@mui/material';
import { AddRounded } from '@mui/icons-material';

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
    setOpen(false);
  }, [mutate, department]);

  const handleDepartmentChange = (e) => setDepartment(e.target.value);
  const handleOrganizationChange = (e) => setOrganizationId(e.target.value);

  const [open, setOpen] = React.useState(false);

  const handleCreateDepartmentDialogOpen = () => {
    setOpen(true);
  };

  const handleCreateDepartmentDialogClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', flex: '1', p: '1.5rem' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant='h5'>Departments</Typography>
        <Button
          variant='text'
          onClick={handleCreateDepartmentDialogOpen}
          size='small'
          startIcon={<AddRounded sx={{ color: 'primary.main' }} />}
          sx={{ color: 'grey.900', ml: 'auto' }}
        >
          Create Department
        </Button>
        <Dialog
          open={open}
          onClose={handleCreateDepartmentDialogClose}
          fullWidth
          maxWidth='xs'
        >
          <DialogTitle>Create Department</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'grid', gap: 3, pt: 3 }}>
              {userAuth?.role === ROLES.SUPER_ADMIN && (
                <FormControl size='small'>
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
                label='Department'
                value={department}
                type='text'
                required={true}
                onChange={handleDepartmentChange}
                size='small'
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              size='small'
              variant='text'
              onClick={handleCreateDepartmentDialogClose}
            >
              Cancel
            </Button>
            <Button
              size='small'
              isLoading={creatingDepartment}
              onClick={() => createDepartment()}
              disabled={!!organizationId && department.length < 2}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Card>
        <CardContent>
          <Loader isLoading={isLoading || creatingDepartment} />
          <TableContainer component={Paper} variant='outlined'>
            <Table size='small' aria-label='simple table'>
              <TableHead sx={{ backgroundColor: 'grey.100' }}>
                <TableRow>
                  <TableCell sx={{ color: 'primary.dark', fontWeight: '500' }}>
                    Id
                  </TableCell>
                  <TableCell sx={{ color: 'primary.dark', fontWeight: '500' }}>
                    Name
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {departmentsList?.map((dept) => (
                  <TableRow
                    key={dept?.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Typography>{dept?.id}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{dept?.name}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

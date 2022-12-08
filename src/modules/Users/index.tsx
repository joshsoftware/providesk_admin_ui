import { useCallback, useContext, useMemo, useState } from 'react';

import { useUsers } from 'modules/Ticket/ticket.hook';
import { UserContext } from 'App';
import { ROLES } from 'routes/roleConstants';
import { useDepartments } from 'modules/Category/category.hook';
import Loader from 'modules/Auth/components/Loader';
import Search from 'modules/shared/Search';

import {
  Box,
  Card,
  CardContent,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select as SelectMUI,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EditUser from './components/EditUser';

export const Users = () => {
  const { userAuth } = useContext(UserContext);

  const [organizationId, setOrganizationId] = useState<number>(
    userAuth?.organizations?.[0]?.id
  );
  const [departmentId, setDepartmentId] = useState<number | 'unassigned'>(
    userAuth?.organizations?.[0]?.department_id | 0
  );
  const [search, setSearch] = useState<string>('');
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [user, setUser] = useState<{ id: string; name: string } | {}>({});

  const { data: departmentsList, isLoading: isFetchingDepartments } =
    useDepartments(organizationId);
  const { data: usersList, isLoading: isFetchingUsers } = useUsers(
    departmentId,
    organizationId
  );

  const handleOrganizationChange = useCallback(
    (e) => setOrganizationId(e.target.value),
    []
  );
  const handleDepartmentChange = useCallback(
    (e) => setDepartmentId(e.target.value),
    []
  );
  const handleEdit = useCallback((e) => setOpenEdit(true), []);

  const filteredUsers = useMemo(() => {
    return usersList?.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [usersList, search]);

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', flex: '1', p: '1.5rem' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant='h5'>Users</Typography>
      </Box>
      <Card>
        <CardContent>
          <Loader isLoading={isFetchingDepartments || isFetchingUsers} />
          <Box sx={{ gap: 3, mb: 3 }} className='filers-wrapper'>
            <Box sx={{ flex: '1', gap: 3 }} className='form-control-wrapper'>
              {userAuth.role === ROLES.SUPER_ADMIN && (
                <FormControl size='small' sx={{ minWidth: '15rem' }}>
                  <InputLabel id='select-organization'>
                    Select Organization
                  </InputLabel>
                  <SelectMUI
                    labelId='select-organization'
                    id='select-organization'
                    value={organizationId}
                    onChange={handleOrganizationChange}
                    label='Select Organization'
                  >
                    {userAuth?.organizations?.map((org) => (
                      <MenuItem key={org.name} value={org.id}>
                        {org.name}
                      </MenuItem>
                    ))}
                  </SelectMUI>
                </FormControl>
              )}
              <FormControl size='small' sx={{ minWidth: '15rem' }}>
                <InputLabel id='department-selector-id'>Department</InputLabel>
                <SelectMUI
                  placeholder='Select Department'
                  required={true}
                  labelId='department-selector-id'
                  id='department-selector'
                  value={departmentId?.toString()}
                  label='Department'
                  onChange={handleDepartmentChange}
                >
                  <MenuItem key={'None'} value={0}>
                    -Select-
                  </MenuItem>
                  <MenuItem key={'unassigned'} value={'unassigned'}>
                    Unassigned
                  </MenuItem>
                  {departmentsList?.map((item) => (
                    <MenuItem key={item.name} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </SelectMUI>
              </FormControl>
            </Box>
            <FormControl>
              <Search
                label={'Search Employee'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                name='search'
              />
            </FormControl>
          </Box>
          <TableContainer component={Paper} variant='outlined'>
            {usersList?.length > 0 ? (
              <Table size='small' aria-label='sticky table'>
                <TableHead sx={{ backgroundColor: 'grey.100' }}>
                  <TableRow>
                    <TableCell
                      sx={{ color: 'primary.main', fontWeight: '500' }}
                    >
                      Id
                    </TableCell>
                    <TableCell
                      sx={{ color: 'primary.main', fontWeight: '500' }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      sx={{ color: 'primary.main', fontWeight: '500' }}
                    >
                      Role
                    </TableCell>
                    <TableCell
                      sx={{ color: 'primary.main', fontWeight: '500' }}
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers?.map((row) => (
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
                      <TableCell style={{ textTransform: 'uppercase' }}>
                        <Typography>{row.role}</Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        <IconButton
                          aria-label='edit'
                          onClick={(e) => {
                            setUser(row);
                            handleEdit(e);
                          }}
                          sx={{ p: 1 }}
                        >
                          <EditIcon sx={{ fontSize: '1rem' }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography variant='h6' sx={{ p: 3, textAlign: 'center' }}>
                {departmentId
                  ? 'No such employees found'
                  : 'Select department to see employees'}
              </Typography>
            )}
          </TableContainer>
        </CardContent>
      </Card>
      <Modal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        sx={{ overflow: 'scroll' }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <EditUser user={user} organizationId={1} setOpenEdit={setOpenEdit} />
      </Modal>
    </Box>
  );
};

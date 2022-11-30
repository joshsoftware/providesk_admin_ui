import { useCallback, useContext, useMemo, useState } from 'react';

import { useUsers } from 'modules/Ticket/ticket.hook';
import { UserContext } from 'App';
import { ROLES } from 'routes/roleConstants';
import { useDepartments } from 'modules/Category/category.hook';
import Loader from 'modules/Auth/components/Loader';
import Search from 'modules/shared/Search';

import {
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
    <div>
      <Loader isLoading={isFetchingDepartments || isFetchingUsers} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography variant='h5'>Users List</Typography>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          {userAuth.role === ROLES.SUPER_ADMIN && (
            <FormControl variant='standard' sx={{ m: 3, minWidth: 120 }}>
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

          <FormControl variant='standard' sx={{ m: 3, minWidth: 120 }}>
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
                <em> -Select- </em>
              </MenuItem>
              <MenuItem key={'unassigned'} value={'unassigned'}>
                <span> Unassigned </span>
              </MenuItem>
              {departmentsList?.map((item) => (
                <MenuItem key={item.name} value={item.id}>
                  <span>{item.name}</span>
                </MenuItem>
              ))}
            </SelectMUI>
          </FormControl>
          <FormControl variant='standard' sx={{ m: 3, minWidth: 120 }}>
            <Search
              label={'Search Employee'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              name='search'
            />
          </FormControl>
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
                <TableCell sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                  Role
                </TableCell>
                <TableCell
                  sx={{ fontSize: '1rem', fontWeight: 'bold' }}
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers?.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell style={{ textTransform: 'uppercase' }}>
                    {row.role}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <IconButton
                      aria-label='edit'
                      size='large'
                      onClick={(e) => {
                        setUser(row);
                        handleEdit(e);
                      }}
                    >
                      <EditIcon fontSize='inherit' />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
      </div>
    </div>
  );
};

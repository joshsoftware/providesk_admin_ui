import { useCallback, useState, useMemo, useContext } from 'react';

import { useDepartments } from 'modules/Category/category.hook';
import Loader from 'modules/Auth/components/Loader';
import Select from 'modules/shared/Select';
import { Button } from 'modules/shared/Button';
import { useEditUser } from '../users.hook';
import { getAllowedRoles } from '../users.helpers';
import { UserContext } from 'App';
import { ROLES } from 'routes/roleConstants';
import ROUTE from 'routes/constants';
import { IEditUserPayload } from '../type';

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select as SelectMUI,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const EditUser = ({ user, organizationId, setOpenEdit }) => {
  const { userAuth } = useContext(UserContext);

  const { data: departmentsList, isLoading: isFetchingDepartments } =
    useDepartments(organizationId);
  const [departmentId, setDepartmentId] = useState<number | ''>(
    user?.department_id || ''
  );
  const [role, setRole] = useState<string>(user?.role);
  const allowedRoles = getAllowedRoles(userAuth?.role);
  const { mutate: updateUser, isLoading: isUpdatingUser } = useEditUser();

  const handleRoleChange = useCallback((e) => setRole(e.target.value), []);
  const handleUpdateUser = useCallback(() => {
    const payload: IEditUserPayload = {
      role,
      department_id: departmentId as number,
    };
    updateUser({ id: user?.id, payload, setOpenEdit });
  }, [role, departmentId]);

  const deptOptions = useMemo(() => {
    if (userAuth?.role === ROLES.DEPARTMENT_HEAD)
      setDepartmentId(userAuth.organizations[0].department_id);
    return (
      departmentsList?.map((dept) => ({ label: dept.name, value: dept.id })) ||
      []
    );
  }, [departmentsList]);

  // allows department head to edit employees of his department only or employees without any department allocated
  if (userAuth.role === ROLES.DEPARTMENT_HEAD) {
    if (
      !(
        user.department_id === null ||
        user.department_id === userAuth.organizations?.[0]?.department_id
      )
    ) {
      window.location.href = ROUTE.UNAUTHORIZED;
    }
  }

  return (
    <Box
      sx={{
        m: 'auto',
        bgcolor: 'background.paper',
        boxShadow: 24,
        pt: 2,
        px: 2,
        pb: 3,
        maxWidth: 600,
      }}
    >
      <CloseIcon
        style={{ float: 'right', cursor: 'pointer' }}
        onClick={() => setOpenEdit(false)}
      />
      <Loader isLoading={isFetchingDepartments || isUpdatingUser} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          margin: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant='h5'>Edit User</Typography>
        <div
          style={{
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            margin: 20,
            maxWidth: 600,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FormControl variant='standard' sx={{ m: '1rem 0', minWidth: 240 }}>
            <InputLabel id='select-role'>Role</InputLabel>
            <SelectMUI
              labelId='select-role'
              id='select-role'
              value={role}
              onChange={handleRoleChange}
              label='Change Role'
            >
              {allowedRoles.map((role) => (
                <MenuItem key={role} value={role.toLowerCase()}>
                  {role.toUpperCase()}
                </MenuItem>
              ))}
            </SelectMUI>
          </FormControl>

          <Select
            sx={{ minWidth: 240 }}
            name='department'
            required={true}
            label={'Department'}
            value={departmentId}
            options={deptOptions}
            onChange={(e) => setDepartmentId(parseInt(e.target.value))}
          />

          <Button
            disabled={false}
            type='submit'
            onClick={handleUpdateUser}
            style={{ height: '40px', margin: '1.5rem auto' }}
          >
            Update
          </Button>
        </div>
      </div>
    </Box>
  );
};

export default EditUser;

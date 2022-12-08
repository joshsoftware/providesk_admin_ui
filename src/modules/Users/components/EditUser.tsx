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
  Paper,
  Select as SelectMUI,
  Typography,
} from '@mui/material';

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
      component={Paper}
      sx={{
        maxHeight: 'calc(100% - 64px)',
        maxWidth: '444px',
        width: 'calc(100% - 64px)',
      }}
    >
      <Loader isLoading={isFetchingDepartments || isUpdatingUser} />
      <Box sx={{ px: 4, py: 3 }}>
        <Typography variant='h6'>Edit User</Typography>
      </Box>
      <Box sx={{ display: 'grid', gap: 3, px: 4, py: '1.25rem' }}>
        <FormControl size='small'>
          <InputLabel id='select-role'>Change Role</InputLabel>
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
          name='department'
          required={true}
          label={'Department'}
          value={departmentId}
          options={deptOptions}
          onChange={(e) => setDepartmentId(parseInt(e.target.value))}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, p: 2 }}>
        <Button variant='text' onClick={() => setOpenEdit(false)}>
          Cancel
        </Button>
        <Button disabled={false} type='submit' onClick={handleUpdateUser}>
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default EditUser;

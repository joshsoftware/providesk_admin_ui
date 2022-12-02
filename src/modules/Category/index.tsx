import { useCallback, useContext, useState } from 'react';

import { categoryValidationRegex, prioritiesList } from './constanst';
import { useCreateCategory, useDepartments } from './category.hook';
import CategoryList from './components/CategoryList';
import { Button } from 'modules/shared/Button';
import Loader from 'modules/Auth/components/Loader';
import { UserContext } from 'App';
import { ROLES } from 'routes/roleConstants';

import {
  Box,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Select as SelectMUI,
  TextField,
  Typography,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';

export const Category = () => {
  const { userAuth } = useContext(UserContext);

  const [organizationId, setOrganizationId] = useState<number | ''>(
    userAuth?.organizations?.[0]?.id || ''
  );

  const [category, setCategory] = useState<string>('');
  const [departmentId, setDepartmentId] = useState<number>(
    userAuth?.organizations?.[0]?.department_id || 0
  );
  const [priority, setPriority] = useState<number>(0);
  const [error, setError] = useState<string>('');

  const { mutate, isLoading: isCreatingCategory } = useCreateCategory();
  const { data: departmentsList, isLoading: isFetchingDepartment } =
    useDepartments(organizationId);

  const handleOrganizationChange = useCallback(
    (e) => setOrganizationId(e.target.value),
    []
  );
  const handleDepartmentChange = useCallback(
    (e) => setDepartmentId(e.target.value),
    []
  );

  const createCategory = useCallback(() => {
    let payload = {
      category: {
        name: category.trim(),
        priority: priority,
        department_id: departmentId,
      },
    };
    mutate(payload);
  }, [category, priority, departmentId]);

  return (
    <>
      <div
        style={{
          marginTop: '3rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Loader isLoading={isFetchingDepartment || isCreatingCategory} />
        <Paper elevation={2} sx={{ padding: 3, minWidth: '20rem', mb: 5 }}>
          <Typography
            variant='h5'
            component='div'
            sx={{ mt: 1, textAlign: 'center' }}
          >
            Create Category
          </Typography>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
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
                    <MenuItem value={org.id}>{org.name}</MenuItem>
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
                disabled={userAuth.role === ROLES.DEPARTMENT_HEAD}
                label='Department'
                onChange={handleDepartmentChange}
              >
                <MenuItem key={'None'} value={0}>
                  <em> -Select- </em>
                </MenuItem>
                {departmentsList?.map((item) => (
                  <MenuItem key={item.name} value={item.id}>
                    <span>{item.name}</span>
                  </MenuItem>
                ))}
              </SelectMUI>
            </FormControl>

            <Box sx={{ m: 3, minWidth: 120 }}>
              <TextField
                label='Category'
                value={category}
                type='text'
                error={!!error}
                required={true}
                autoFocus={true}
                variant='standard'
                onChange={(e) => {
                  if (categoryValidationRegex.test(e.target.value)) {
                    setCategory(e.target.value);
                    setError('');
                  } else {
                    setError('Special characters are not allowed.');
                  }
                }}
              />
              {error && (
                <Typography
                  variant='caption'
                  display='block'
                  color='#d32f2f'
                  gutterBottom
                  style={{ fontSize: '11px' }}
                >
                  {error}
                </Typography>
              )}
            </Box>

            <FormControl variant='standard' sx={{ m: 3, minWidth: 120 }}>
              <InputLabel id='priority-selector-id'>Priority</InputLabel>
              <SelectMUI
                placeholder='Select Priority'
                required={true}
                labelId='priority-selector-id'
                id='priority-selector'
                value={priority?.toString()}
                label='Priority'
                onChange={(e: SelectChangeEvent) =>
                  setPriority(parseInt(e.target.value))
                }
              >
                {prioritiesList?.map((item) => (
                  <MenuItem key={item.value} value={item.id}>
                    <span>{item.value}</span>
                  </MenuItem>
                ))}
              </SelectMUI>
            </FormControl>

            <Button
              onClick={() => {
                createCategory();
                setPriority(0);
                setDepartmentId(0);
                setCategory('');
              }}
              isLoading={isCreatingCategory}
              style={{ height: '40px' }}
              sx={{ m: 3 }}
              disabled={
                category.length < 2 || departmentId === 0 || isCreatingCategory
              }
            >
              Create
            </Button>
          </div>
        </Paper>
        <br />
        <CategoryList />
      </div>
    </>
  );
};

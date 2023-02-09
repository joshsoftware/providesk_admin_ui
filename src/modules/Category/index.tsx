import * as React from 'react';
import { useCallback, useContext, useState } from 'react';
import {
  categoryValidationRegex,
  prioritiesList,
  slaDurationTypeOptions,
} from './constant';
import { useCreateCategory, useDepartments } from './category.hook';
import CategoryList from './components/CategoryList';
import { Button } from 'modules/shared/Button';
import Loader from 'modules/Auth/components/Loader';
import { UserContext } from 'App';
import { ROLES } from 'routes/roleConstants';

import {
  Box,
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
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { AddRounded } from '@mui/icons-material';

export const Category = () => {
  const { userAuth } = useContext(UserContext);

  const [organizationId, setOrganizationId] = useState<number | ''>(
    userAuth?.organizations?.[0]?.id || ''
  );

  const [category, setCategory] = useState<string>('');
  const [departmentId, setDepartmentId] = useState<number>(
    userAuth?.organizations?.[0]?.department_id || 1
  );
  const [priority, setPriority] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [slaUnit, setSlaUnit] = useState<number>(1);
  const [slaDurationType, setSlaDurationType] = useState<string>('Days');

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
        sla_unit: slaUnit,
        sla_duration_type: slaDurationType,
      },
    };
    mutate(payload);
    setOpen(false);
  }, [category, priority, departmentId, slaUnit, slaDurationType, mutate]);

  const [open, setOpen] = React.useState(false);

  const handleCreateCategoryDialogOpen = () => {
    setOpen(true);
  };

  const handleCreateCategoryDialogClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', flex: '1', p: '1.5rem' }}
    >
      <Loader isLoading={isFetchingDepartment || isCreatingCategory} />
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant='h5'>Categories</Typography>
        <Button
          variant='text'
          onClick={handleCreateCategoryDialogOpen}
          startIcon={<AddRounded sx={{ color: 'primary.main' }} />}
          sx={{ color: 'grey.900', ml: 'auto' }}
        >
          Create Category
        </Button>
        <Dialog
          open={open}
          onClose={handleCreateCategoryDialogClose}
          fullWidth
          maxWidth='xs'
        >
          <DialogTitle>Create Department</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'grid', gap: 3, pt: 3 }}>
              {userAuth.role === ROLES.SUPER_ADMIN && (
                <FormControl size='small'>
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
              <FormControl size='small'>
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
                    -Select-
                  </MenuItem>
                  {departmentsList?.map((item) => (
                    <MenuItem key={item.name} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </SelectMUI>
              </FormControl>
              <Box sx={{ display: 'grid' }}>
                <TextField
                  label='Category'
                  value={category}
                  type='text'
                  error={!!error}
                  required={true}
                  autoFocus={true}
                  onChange={(e) => {
                    if (categoryValidationRegex.test(e.target.value)) {
                      setCategory(e.target.value);
                      setError('');
                    } else {
                      setError('Special characters are not allowed.');
                    }
                  }}
                  size='small'
                />
                {error && (
                  <Typography
                    variant='body1'
                    component='p'
                    sx={{
                      color: 'error.main',
                      p: '0.125rem 0.875rem 0 0.875rem',
                    }}
                  >
                    {error}
                  </Typography>
                )}
              </Box>
              <FormControl size='small'>
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
                      {item.value}
                    </MenuItem>
                  ))}
                </SelectMUI>
              </FormControl>
              <Box sx={{ display: 'flex' }}>
                <TextField
                  sx={{ marginRight: 2 }}
                  label='Duration for SLA'
                  value={slaUnit}
                  type='number'
                  error={!!error}
                  required={true}
                  autoFocus={true}
                  onChange={(e) => {
                    setSlaUnit(+e.target.value);
                    setError('');
                  }}
                  InputProps={{ inputProps: { min: 0 } }}
                  size='small'
                />
                {error && (
                  <Typography
                    variant='body1'
                    component='p'
                    sx={{
                      color: 'error.main',
                      p: '0.125rem 0.875rem 0 0.875rem',
                    }}
                  >
                    {error}
                  </Typography>
                )}
                <FormControl size='small'>
                  <InputLabel id='slaDuration-selector-id'>Type</InputLabel>
                  <SelectMUI
                    placeholder='SLA Duration Type'
                    required={true}
                    labelId='slaDuration-selector-id'
                    id='slaDuration-selector-id'
                    value={slaDurationType}
                    label='SLA Duration Type'
                    onChange={(e: SelectChangeEvent) =>
                      setSlaDurationType(e.target.value)
                    }
                    sx={{ width: '100px' }}
                  >
                    {slaDurationTypeOptions?.map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </SelectMUI>
                </FormControl>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button variant='text' onClick={handleCreateCategoryDialogClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                createCategory();
                setPriority(0);
                setDepartmentId(0);
                setCategory('');
              }}
              isLoading={isCreatingCategory}
              disabled={
                category.length < 2 || departmentId === 0 || isCreatingCategory
              }
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <CategoryList />
    </Box>
  );
};

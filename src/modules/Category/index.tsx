import { useContext, useState } from 'react';

import { categoryValidationRegex, prioritiesList } from './constanst';
import { useCreateCategory, useDepartments } from './category.hook';
import CategoryList from './components/CategoryList';
import { Button } from 'modules/shared/Button';
import Loader from 'modules/Auth/components/Loader';
import { UserContext } from 'App';

import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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
  const [departmentId, setDepartmentId] = useState<number>(0);
  const [priority, setPriority] = useState<number>(0);
  const [error, setError] = useState<string>('');

  const { mutate, isLoading: isCreatingCategory } = useCreateCategory();
  const { data: departmentsList, isLoading: isFetchingDepartment } =
    useDepartments(organizationId);

  const createCategory = () => {
    let payload = {
      categories: {
        name: category,
        priority: priority,
        department_id: departmentId,
      },
    };
    mutate(payload);
  };

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
        <Loader isLoading={isFetchingDepartment && isCreatingCategory} />
        <Divider>
          <Typography variant='h4' component='div'>
            Create Category
          </Typography>
        </Divider>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ m: 3, minWidth: 120 }}>
            <TextField
              label='Category'
              value={category}
              type='text'
              error={!!error}
              required={true}
              autoFocus={true}
              variant='standard'
              color='secondary'
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
            <Select
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
            </Select>
          </FormControl>

          <FormControl variant='standard' sx={{ m: 3, minWidth: 120 }}>
            <InputLabel id='department-selector-id'>Department</InputLabel>
            <Select
              placeholder='Select Department'
              required={true}
              labelId='department-selector-id'
              id='department-selector'
              value={departmentId?.toString()}
              label='Department'
              onChange={(e: SelectChangeEvent) =>
                setDepartmentId(parseInt(e.target.value))
              }
            >
              <MenuItem key={'None'} value={0}>
                <em> -Select- </em>
              </MenuItem>
              {departmentsList?.map((item) => (
                <MenuItem key={item.name} value={item.id}>
                  <span>{item.name}</span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            onClick={() => {
              createCategory();
              setPriority(0);
              setDepartmentId(0);
              setCategory('');
            }}
            className='btn btn-success mx-3'
            style={{ height: '40px' }}
            sx={{ m: 3 }}
            disabled={
              category.length < 2 || departmentId === 0 || isCreatingCategory
            }
          >
            Create
          </Button>
        </div>
        <br />
        <CategoryList />
      </div>
    </>
  );
};

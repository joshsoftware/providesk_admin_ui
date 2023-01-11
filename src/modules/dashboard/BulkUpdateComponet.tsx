import { EditRounded } from '@mui/icons-material';
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { UserContext } from 'App';
import { useCategories, useDepartments } from 'modules/Category/category.hook';
import Select, { CustomSelect } from 'modules/shared/Select';
import { useUsers } from 'modules/Ticket/ticket.hook';
import { useCallback, useContext, useMemo, useState } from 'react';

export const BulkUpdateComponent = ({ statuslist, selectedTicket }) => {
  const [payload, setpayloadload] = useState<PayLoadBulkUpload>();
  const handleChange = useCallback(
    (
      name: 'department_id' | 'category_id' | 'resolver_id' | 'status',
      value: string
    ) => {
      setpayloadload((p) => ({ ...p, [name]: value }));
    },
    [setpayloadload]
  );
  const { userAuth } = useContext(UserContext);
  const { data: categoriesList, isLoading: listFetching } = useCategories(
    payload?.department_id
  );
  const categoryOptions = useMemo(() => {
    return (
      categoriesList?.map((cate) => ({
        label: cate.name,
        value: cate.id,
      })) || []
    );
  }, [categoriesList]);

  const [organizationId, setOrganizationId] = useState<number>(
    userAuth?.organizations?.[0]?.id
  );
  const { data: departmentsList, isLoading: departmentsFetching } =
    useDepartments(organizationId);

  const deptOptions = useMemo(() => {
    return (
      departmentsList?.map((dept) => ({
        label: dept.name,
        value: dept.id,
      })) || []
    );
  }, [departmentsList]);
  const { data: usersList, isLoading: isFetchingUsers } = useUsers(
    payload?.department_id
  );
  const userResolverList = useMemo(() => {
    const list =
      usersList?.map((emp) => {
        return {
          label: emp.name,
          value: emp.id + '',
        };
      }) || [];
    return [{ label: 'None', value: '' }, ...list];
  }, [usersList]);

  return (
    <Box display={'flex'}>
      <CustomSelect
        label={'Status'}
        options={statusOptions}
        value={payload?.status!}
        onChange={(e) => handleChange('status', e.target.value)}
        name='status'
      />
      <CustomSelect
        label={'Departments'}
        options={deptOptions}
        value={payload?.department_id!}
        onChange={(e) => {
          handleChange('department_id', e.target.value);
          handleChange('resolver_id', '');
          handleChange('category_id', '');
        }}
        name='department_id'
      />
      <CustomSelect
        label={'Category'}
        options={categoryOptions}
        value={payload?.category_id!}
        onChange={(e) => handleChange('category_id', e.target.value)}
        name='category_id'
      />
      <Select
        label={'Resolver'}
        options={userResolverList}
        value={payload?.resolver_id + ''}
        onChange={(e) => {
          handleChange('resolver_id', e.target.value);
        }}
        name='resolver_id'
        disabled={payload?.department_id == ''}
      />
      <Button
        variant='text'
        startIcon={<EditRounded sx={{ color: 'primary.main' }} />}
        sx={{ color: 'grey.900' }}
        onClick={() => {}}
      >
        Update
      </Button>
    </Box>
  );
};

interface PayLoadBulkUpload {
  department_id: string;
  category_id: string;
  resolver_id: string;
  status: string;
}

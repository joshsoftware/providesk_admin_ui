import { MenuItem } from '@mui/material';

import { UserContext } from 'App';
import { useCategories, useDepartments } from 'modules/Category/category.hook';
import { Button } from 'modules/shared/Button';
import Select, { CustomSelect } from 'modules/shared/Select';
import { useUsers } from 'modules/Ticket/ticket.hook';
import { useCallback, useContext, useMemo, useState } from 'react';
import { STATUS } from './constant';
import { usePostBulkUpdate } from './dashboard.hooks';
import { BulkUpload, PayloadBulkUpload, SelectedTicket } from './types';

export const BulkUpdateComponent = ({
  selectedTicketForBulkUpdate,
  setSeletedTicketForBulkUpdate,
  setFilterMenu,
}: {
  selectedTicketForBulkUpdate: SelectedTicket;
  setSeletedTicketForBulkUpdate: (a: SelectedTicket) => void;
  setFilterMenu: (a: any) => void;
}) => {
  const [payload, setpayloadload] = useState<BulkUpload>({
    department_id: '',
    category_id: '',
    resolver_id: '',
    status: '',
  });

  const { userAuth } = useContext(UserContext);
  const [organizationId, setOrganizationId] = useState<number>(
    userAuth?.organizations?.[0]?.id
  );

  const SuccessCallbackFunction = useCallback(() => {
    setpayloadload({
      department_id: '',
      category_id: '',
      resolver_id: '',
      status: '',
    });
    setSeletedTicketForBulkUpdate({
      id: [],
      status: '',
      permited_transitions: [],
    });
    setFilterMenu(null);
  }, [setFilterMenu, setSeletedTicketForBulkUpdate, setpayloadload]);
  const { isLoading, mutate } = usePostBulkUpdate(SuccessCallbackFunction);
  const { data: categoriesList, isLoading: listFetching } = useCategories(
    payload?.department_id
  );
  const { data: departmentsList, isLoading: departmentsFetching } =
    useDepartments(organizationId);

  const { data: usersList, isLoading: isFetchingUsers } = useUsers(
    payload?.department_id
  );

  const statusOptions = useMemo(
    () =>
      selectedTicketForBulkUpdate.permited_transitions?.map((item) => ({
        label: STATUS[item],
        value: item,
      })),
    [selectedTicketForBulkUpdate]
  );

  const categoryOptions = useMemo(() => {
    return (
      categoriesList?.map((cate) => ({
        label: cate.name,
        value: cate.id,
      })) || []
    );
  }, [categoriesList]);

  const deptOptions = useMemo(() => {
    return (
      departmentsList?.map((dept) => ({
        label: dept.name,
        value: dept.id,
      })) || []
    );
  }, [departmentsList]);

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

  const handleChange = useCallback(
    (
      name: 'department_id' | 'category_id' | 'resolver_id' | 'status',
      value: string
    ) => {
      setpayloadload((p: BulkUpload) => ({ ...p, [name]: value }));
    },
    [setpayloadload]
  );

  const updateAllStatus = useCallback(() => {
    const payLoad: PayloadBulkUpload = {
      ticket: {
        ticket_ids: selectedTicketForBulkUpdate.id,
        department_id: payload.department_id as string,
        resolver_id: +payload.resolver_id,
        category_id: payload.category_id,
        status: payload.status,
      },
    };
    mutate(payLoad);
  }, [mutate, selectedTicketForBulkUpdate, payload]);

  return (
    <>
      <MenuItem>
        <CustomSelect
          label={'Status'}
          options={statusOptions}
          value={payload?.status!}
          onChange={(e) => handleChange('status', e.target.value)}
          name='status'
        />
      </MenuItem>
      <MenuItem>
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
      </MenuItem>
      <MenuItem>
        <CustomSelect
          label={'Category'}
          options={categoryOptions}
          value={payload?.category_id!}
          onChange={(e) => handleChange('category_id', e.target.value)}
          name='category_id'
          disabled={payload?.department_id == ''}
        />
      </MenuItem>
      <MenuItem>
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
      </MenuItem>
      <MenuItem sx={{ justifyContent: 'end' }}>
        <Button
          onClick={() => {
            updateAllStatus();
          }}
          isLoading={isLoading}
        >
          Update
        </Button>
      </MenuItem>
    </>
  );
};

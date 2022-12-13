import { useCallback, useContext, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import moment from 'moment';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select as SelectMUI,
  TextField,
  Typography,
} from '@mui/material';

import { useCategories, useDepartments } from 'modules/Category/category.hook';
import { useUsers } from 'modules/Ticket/ticket.hook';
import { useProcessTicket, useReopenTicket } from '../details.hook';
import {
  IEditTicketPayload,
  IEditTicketProps,
  IReopenTicketPayload,
} from '../type';
import { UserContext } from 'App';
import Select from 'modules/shared/Select';
import { Button } from 'modules/shared/Button';
import { editTicketValidationSchema as validationSchema } from '../details.helpers';
import RadioGroupRating from './Rating';
import Loader from 'modules/Auth/components/Loader';
import { UploadBucket } from 'modules/shared/UploadBucket';
import { uploadFile } from 'apis/utils/mediaUpload/awsmedia';

export const UpdateTicketForm = ({
  ticket,
  id,
  setOpenEdit,
}: IEditTicketProps) => {
  const { userAuth } = useContext(UserContext);

  const [organizationId, setOrganizationId] = useState<number | ''>(
    userAuth?.organizations?.[0]?.id || ''
  );
  const [departmentId, setDepartmentId] = useState<number | ''>(
    parseInt(ticket?.department_id) || ''
  );

  const { data: departmentsList, isLoading: isFetchingDepartments } =
    useDepartments(organizationId);
  const { data: categoriesList, isLoading: isFetchingCategories } =
    useCategories(departmentId);
  const { data: usersList, isLoading: isFetchingUsers } =
    useUsers(departmentId);
  const { mutate: editTicket, isLoading: isUpdatingTicket } =
    useProcessTicket();
  const { mutate: reopenTicket, isLoading: isReopeningTicket } =
    useReopenTicket();

  const [file, setFile] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const deptOptions = useMemo(
    () =>
      departmentsList?.map((dept) => ({
        label: dept.name,
        value: dept.id,
      })) || [],
    [departmentsList]
  );

  const categoryOptions = useMemo(() => {
    return (
      categoriesList?.map((cate) => ({
        label: cate.name,
        value: cate.id,
      })) || []
    );
  }, [categoriesList]);

  const userOptions = useMemo(() => {
    return (
      usersList?.map((cate) => ({
        label: cate.name,
        value: cate.id,
      })) || []
    );
  }, [usersList]);

  const handleUpdateTicket = useCallback(
    ({
      department_id,
      category_id,
      resolver_id,
      reason_for_update,
      status,
      asset_url,
      eta,
    }) => {
      let ticketDetails: IEditTicketPayload = {
        department_id,
        category_id,
        resolver_id,
        reason_for_update,
        status,
        asset_url,
        eta:
          eta !== '' ? moment(new Date(eta)).format('DD/MM/YYYY') : undefined,
      };
      editTicket({
        id,
        ticket_details: { ticket: ticketDetails },
        setOpenEdit,
      });
    },
    []
  );

  const handleReopenTicket = useCallback(
    ({
      is_customer_satisfied,
      rating,
      state_action,
      started_reason,
      asset_url,
    }) => {
      let ticketDetails: IReopenTicketPayload = {
        is_customer_satisfied,
        rating: parseInt(rating),
        state_action,
        started_reason,
        asset_url,
      };
      reopenTicket({
        id,
        ticket_result: { ticket_result: ticketDetails },
        setOpenEdit,
      });
    },
    []
  );
  const handleChangeFile = useCallback((e: File[]) => {
    setFile((p) => [...p, ...e]);
  }, []);
  const removeFile = useCallback((index: number) => {
    setFile((oldfile) => {
      return oldfile.filter((val, ind) => ind != index);
    });
  }, []);
  const initialValues = {
    department_id: ticket?.department_id || '',
    category_id: ticket?.category_id || '',
    resolver_id: ticket?.resolver_id || '',
    reason_for_update: '',
    status: ticket?.status || '',
    is_customer_satisfied: false,
    rating: 0,
    state_action: 'reopen',
    started_reason: '',
    asset_url: [] as string[],
    eta: '',
  };

  const {
    values,
    touched,
    errors,
    handleChange,
    handleSubmit,
    handleBlur,
    resetForm,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { pro, name } = uploadFile(file, setIsLoading);
      Promise.all(pro)
        .then((e) => {
          setIsLoading(false);
          if (values.status === 'reopen')
            handleReopenTicket({ ...values, asset_url: name });
          else handleUpdateTicket({ ...values, asset_url: name });
        })
        .catch((e) => {
          toast.error('failed to upload image');
          setIsLoading(false);
          console.log(e, 'error');
        });
    },
  });

  return (
    <Box
      component={Paper}
      sx={{
        maxHeight: 'calc(100% - 64px)',
        maxWidth: '444px',
        width: 'calc(100% - 64px)',
      }}
    >
      <Loader
        isLoading={
          isUpdatingTicket ||
          isReopeningTicket ||
          isFetchingDepartments ||
          isFetchingCategories ||
          isFetchingUsers
        }
      />
      <Box sx={{ px: 4, py: 3 }}>
        <Typography variant='h6'>Update Ticket</Typography>
      </Box>
      <Box component={'form'} onSubmit={handleSubmit}>
        <Box sx={{ display: 'grid', gap: 3, px: 4, py: '1.25rem' }}>
          <FormControl size='small'>
            <InputLabel id='ticket-status-selector-id'>Status</InputLabel>
            <SelectMUI
              name='status'
              id='ticket-status-selector-id'
              placeholder='Status'
              required={true}
              value={values.status}
              label='Status'
              onChange={handleChange}
              error={touched.status && Boolean(errors.status)}
            >
              <MenuItem
                key={ticket?.status}
                value={ticket?.status || ''}
                selected
                style={{ textTransform: 'capitalize' }}
              >
                {ticket?.status}
              </MenuItem>
              {ticket?.permited_transitions?.map((item) => (
                <MenuItem
                  key={item}
                  value={item}
                  style={{ textTransform: 'capitalize' }}
                >
                  {item}
                </MenuItem>
              ))}
            </SelectMUI>
          </FormControl>
          {values.status !== 'reopen' && (
            <>
              <FormControl>
                <Select
                  name='department_id'
                  required={true}
                  label={'Department'}
                  value={values.department_id}
                  options={deptOptions}
                  onChange={(e) => {
                    setDepartmentId(parseInt(e.target.value));
                    values.category_id = '';
                    values.resolver_id = '';
                    handleChange(e);
                  }}
                  error={(touched.department_id && errors.department_id) || ''}
                />
              </FormControl>
              <FormControl>
                <Select
                  name='category_id'
                  required={true}
                  label={'Category'}
                  value={values.category_id}
                  options={categoryOptions}
                  onChange={handleChange}
                  error={(touched.category_id && errors.category_id) || ''}
                />
              </FormControl>
              <FormControl>
                <Select
                  name='resolver_id'
                  required={true}
                  label={'Resolver'}
                  value={values.resolver_id}
                  options={userOptions}
                  onChange={handleChange}
                  error={(touched.resolver_id && errors.resolver_id) || ''}
                />
              </FormControl>
              <TextField
                label='ETA'
                type='date'
                name='eta'
                value={values.eta}
                onChange={handleChange}
                size='small'
              />
              <TextField
                label='Comment'
                multiline
                required
                name='reason_for_update'
                value={values.reason_for_update}
                placeholder='Leave a comment'
                onChange={handleChange}
                onBlur={handleBlur}
                size='small'
                error={
                  touched.reason_for_update && Boolean(errors.reason_for_update)
                }
                helperText={errors.reason_for_update}
                FormHelperTextProps={{
                  sx: {
                    fontSize: '0.875rem',
                    p: '0.125rem 0.875rem 0 0.875rem',
                    m: 0,
                  },
                }}
              />
            </>
          )}
          {values.status === 'reopen' && (
            <>
              <FormControl size='small'>
                <InputLabel id='feedback-select-label'>
                  Are you satisfied with the work done?
                </InputLabel>
                <SelectMUI
                  labelId='feedback-select-label'
                  id='feedback-select'
                  value={values.is_customer_satisfied}
                  label='Are you satisfied with the work done?'
                  onChange={handleChange}
                >
                  <MenuItem value={'false'}>No</MenuItem>
                  <MenuItem value={'true'}>Yes</MenuItem>
                </SelectMUI>
              </FormControl>
              <Box>
                <InputLabel
                  id='rating'
                  sx={{
                    fontSize: '0.625rem',
                  }}
                >
                  Rate the work done
                </InputLabel>
                <Box>
                  <RadioGroupRating
                    value={values.rating as number}
                    handleChange={handleChange}
                  />
                  {touched.rating && errors.rating && (
                    <Typography
                      variant='caption'
                      display='block'
                      color='#f44336'
                      gutterBottom
                      style={{ fontSize: '11px', margin: 0, padding: 0 }}
                    >
                      {errors.rating}
                    </Typography>
                  )}
                </Box>
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label='Reason'
                  required
                  name='started_reason'
                  value={values.started_reason}
                  placeholder='Leave a comment'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  size='small'
                />
                {touched.started_reason && errors.started_reason && (
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      p: '0.125rem 0.875rem 0 0.875rem',
                      m: 0,
                      color: 'error.main',
                    }}
                  >
                    {errors.started_reason}
                  </Typography>
                )}
              </Box>
            </>
          )}
          <UploadBucket
            isLoading={isLoading}
            name={'asset_url'}
            value={values.asset_url}
            file={file}
            handleChange={handleChangeFile}
            removeFile={removeFile}
            error={errors.asset_url as string | undefined}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, p: 2 }}>
          <Button variant='text' onClick={() => setOpenEdit(false)}>
            Cancel
          </Button>
          <Button
            type='submit'
            isLoading={isReopeningTicket || isUpdatingTicket}
          >
            {values.status === 'reopen' ? 'Reopen' : 'Update'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

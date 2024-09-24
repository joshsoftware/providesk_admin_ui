import { useCallback, useContext, useMemo, useState } from 'react';
import { useFormik } from 'formik';

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

import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select as SelectMUI,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import { StyleLabel } from 'modules/shared/StyleLabel';
import { UploadBucket } from 'modules/shared/UploadBucket';
import { uploadFile } from 'apis/utils/mediaUpload/awsmedia';
import { toast } from 'react-toastify';
import { ROLES } from 'routes/roleConstants';

export const EditTicketForm = ({
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
    }) => {
      let ticketDetails: IEditTicketPayload = {
        department_id,
        category_id,
        resolver_id,
        reason_for_update,
        status,
        asset_url,
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
    onSubmit: async (values) => {
      try {
        const fileNames = await uploadFile(file, setIsLoading);
        setIsLoading(false); 
        if (values.status === 'reopen') {
          handleReopenTicket({ ...values, asset_url: fileNames });
        } else {
          handleUpdateTicket({ ...values, asset_url: fileNames });
        }
      } catch (error) {
        toast.error('Failed to upload image');
        setIsLoading(false);
        console.log(error, 'error');
      }
    },
  });
  
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
      <Loader
        isLoading={
          isUpdatingTicket ||
          isReopeningTicket ||
          isFetchingDepartments ||
          isFetchingCategories ||
          isFetchingUsers
        }
      />
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          margin: 20,
          alignItems: 'center',
        }}
      >
        <FormControl variant='standard' sx={{ m: 2, minWidth: 120 }}>
          <InputLabel id='ticket-status-selector-id'>Status</InputLabel>
          <SelectMUI
            name='status'
            id='ticket-status-selector-id'
            placeholder='Current Status'
            required={true}
            value={values.status}
            label='Ticket Type'
            onChange={handleChange}
            error={touched.status && Boolean(errors.status)}
          >
          {userAuth.role !== ROLES.EMPLOYEE && (
            <MenuItem
              key={ticket?.status}
              value={ticket?.status || ''}
              selected
              style={{ textTransform: 'capitalize' }}
            >
              <span>{ticket?.status}</span>
            </MenuItem>
          )}
            {ticket?.permited_transitions?.map((item) => (
              <MenuItem
                key={item}
                value={item}
                style={{ textTransform: 'capitalize' }}
              >
                <span>{item}</span>
              </MenuItem>
            ))}
          </SelectMUI>
        </FormControl>

        {values.status !== 'reopen' && (
          <Box
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
        {userAuth.role !== ROLES.EMPLOYEE && (
          <>
            <FormControl sx={{ m: 2, minWidth: 240 }}>
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

            <FormControl sx={{ m: 2, minWidth: 240 }}>
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

            <FormControl sx={{ m: 2, minWidth: 240 }}>
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
          </>
    )}

            <Box>
              <StyleLabel
                text={'Comment'}
                required={true}
                sx={{
                  fontSize: '11px',
                }}
              />
              <TextareaAutosize
                required
                name='reason_for_update'
                value={values.reason_for_update}
                minRows={3}
                maxRows={5}
                style={{
                  border: '0',
                  borderBottom: '1px solid',
                  whiteSpace: 'pre-wrap',
                  outline: 'none',
                  width: '240px',
                }}
                placeholder='Leave a comment'
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.reason_for_update && errors.reason_for_update && (
                <Typography
                  variant='caption'
                  display='block'
                  color='#f44336'
                  gutterBottom
                  style={{ fontSize: '11px', margin: 0, padding: 0 }}
                >
                  {errors.reason_for_update}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {values.status === 'reopen' && (
          <Box>
            {/* <FormControl variant='standard' sx={{ m: 2, minWidth: 240 }}>
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
            </FormControl> */}

            <InputLabel
              id='rating'
              sx={{
                m: 2,
                minWidth: 240,

                fontSize: '11px',
                my: 1,
              }}
            >
              Rate the work done
            </InputLabel>
            <Box sx={{ mx: 2, minWidth: 240 }}>
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

            <Box sx={{ m: 2 }}>
              <StyleLabel
                text={'Reason'}
                required={true}
                sx={{
                  fontSize: '11px',
                }}
              />
              <TextareaAutosize
                required
                name='started_reason'
                value={values.started_reason}
                minRows={3}
                maxRows={5}
                style={{
                  border: '0',
                  borderBottom: '1px solid',
                  whiteSpace: 'pre-wrap',
                  outline: 'none',
                  width: '240px',
                }}
                placeholder='Leave a comment'
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.started_reason && errors.started_reason && (
                <Typography
                  variant='caption'
                  display='block'
                  color='#f44336'
                  gutterBottom
                  style={{ fontSize: '11px', margin: 0, padding: 0 }}
                >
                  {errors.started_reason}
                </Typography>
              )}
            </Box>
          </Box>
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
        <Button
          type='submit'
          className='mx-3'
          isLoading={isReopeningTicket || isUpdatingTicket}
          style={{ height: '40px', marginTop: '1rem' }}
        >
          {values.status === 'reopen' ? 'Reopen' : 'Update'}
        </Button>
      </form>
    </Box>
  );
};

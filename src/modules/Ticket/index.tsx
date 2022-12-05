import { useMemo, useState, useContext, useCallback } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';

import { Button } from 'modules/shared/Button';
import Select from 'modules/shared/Select';

import { ticketTypesList } from './ticket.constants';
import { UserContext } from 'App';
import { ICreateTicketData } from './type';
import { useCategories, useDepartments } from 'modules/Category/category.hook';
import { useCreateTicket, useUsers } from './ticket.hook';

import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select as SelectMUI,
  TextField,
  Typography,
} from '@mui/material';
import { UploadBucket } from 'modules/shared/UploadBucket';
import { uploadFile } from 'apis/utils/mediaUpload/awsmedia';

import Loader from 'modules/Auth/components/Loader';
import { toast } from 'react-toastify';

export const Ticket = () => {
  const { userAuth } = useContext(UserContext);

  const [organizationId, setOrganizationId] = useState<number | ''>(
    userAuth?.organizations?.[0]?.id || ''
  );
  const [departmentId, setDepartmentId] = useState<number | ''>(1);

  const { data: departmentsList, isLoading: isFetchingDepartments } =
    useDepartments(organizationId);
  const { data: categoriesList, isLoading: isFetchingCategories } =
    useCategories(departmentId);
  const { data: usersList, isLoading: isFetchingUsers } =
    useUsers(departmentId);
  const [file, setFile] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    mutate,
    isLoading: creatingTicket,
    data: ticketConfirmation,
  } = useCreateTicket();

  const deptOptions = useMemo(
    () =>
      departmentsList?.map((dept) => ({
        label: dept.name,
        value: dept.id,
      })) || [],
    [departmentsList]
  );
  const handleChangeFile = useCallback((e: File[]) => {
    setFile((p) => [...p, ...e]);
  }, []);
  const removeFile = useCallback((index: number) => {
    setFile((oldfile) => {
      return oldfile.filter((val, ind) => ind !== index);
    });
  }, []);

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

  const createTicket = (values) => {
    let ticket = values as ICreateTicketData;
    let payload = {
      ticket: {
        ...ticket,
        title: ticket.title.trim(),
        description: ticket.description.trim(),
      },
    };
    mutate(payload);
    return;
  };

  const ValidationSchema = yup.object({
    title: yup
      .string()
      .matches(/^[-()., A-Za-z0-9\n]*$/i, 'Special characters are not allowed.')
      .required('Complaint/Request title is required'),
    description: yup
      .string()
      .matches(
        /^[-().,_ A-Za-z0-9@': \n]*$/i,
        'Special characters are not allowed.'
      )
      .required('Complaint/Request description is required'),
    category_id: yup.string().required('Select category'),
    department_id: yup.string().required('Select department'),
    ticket_type: yup.string().required('Select type'),
    resolver_id: yup.string().required('Assign to resolver'),
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      category_id: '',
      department_id: '',
      ticket_type: '',
      resolver_id: '',
      asset_url: [],
    },
    validationSchema: ValidationSchema,
    onSubmit: (values) => {
      let { pro, name } = uploadFile(file, setIsLoading);
      Promise.all(pro)
        .then((e) => {
          setIsLoading(false);
          createTicket({ ...values, asset_url: name });
        })
        .catch((e) => {
          setIsLoading(false);
          toast.error('unable to upload image');
        });
    },
  });

  return (
    <>
      <div
        style={{
          margin: '3rem 0',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Loader
          isLoading={
            isFetchingDepartments ||
            isFetchingCategories ||
            isFetchingUsers ||
            creatingTicket
          }
        />
        <Paper elevation={2} sx={{ padding: 3, minWidth: '20rem' }}>
          <Typography
            variant='h5'
            component='div'
            style={{ textAlign: 'center' }}
          >
            Create Request or Complaint
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <TextField
                sx={{ m: 2 }}
                label='Title'
                name='title'
                minRows={3}
                value={formik.values.title}
                type='text'
                required={true}
                variant='standard'
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                autoFocus={true}
                helperText={formik.touched.title && formik.errors.title}
              />
              <Typography
                variant='caption'
                style={{ margin: '0 0.5rem', fontSize: '11px' }}
              >
                Description *
              </Typography>
              <textarea
                style={{
                  margin: '0 0.5rem',
                  border: '0',
                  borderBottom: '1px solid',
                  whiteSpace: 'pre-wrap',
                  outline: 'none',
                }}
                name='description'
                rows={3}
                value={formik.values.description}
                required={true}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              {formik.touched.description && formik.errors.description ? (
                <Typography
                  variant='caption'
                  display='block'
                  color='#d32f2f'
                  gutterBottom
                  style={{ fontSize: '11px', margin: '0.4rem 1rem' }}
                >
                  {formik.errors.description}
                </Typography>
              ) : (
                ''
              )}

              <FormControl variant='standard' sx={{ m: 2, minWidth: 120 }}>
                <InputLabel id='ticket-type-selector-id'>
                  Ticket Type
                </InputLabel>
                <SelectMUI
                  name='ticket_type'
                  placeholder='Ticket Type'
                  required={true}
                  labelId='ticket-type-selector-id'
                  id='priority-selector'
                  value={formik.values.ticket_type}
                  label='Ticket Type'
                  onChange={formik.handleChange}
                  error={
                    formik.touched.ticket_type &&
                    Boolean(formik.errors.ticket_type)
                  }
                >
                  <MenuItem
                    key={'Select'}
                    value={''}
                    style={{ textTransform: 'capitalize' }}
                  >
                    <span>None</span>
                  </MenuItem>
                  {ticketTypesList?.map((item) => (
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

              <FormControl sx={{ m: 2, minWidth: 120 }}>
                <Select
                  name='department_id'
                  required={true}
                  label={'Department'}
                  value={formik.values.department_id}
                  options={deptOptions}
                  onChange={(e) => {
                    setDepartmentId(parseInt(e.target.value));
                    formik.values.category_id = '';
                    formik.values.resolver_id = '';
                    formik.handleChange(e);
                  }}
                  error={
                    (formik.touched.department_id &&
                      formik.errors.department_id) ||
                    ''
                  }
                />
              </FormControl>

              <FormControl sx={{ m: 2, minWidth: 120 }}>
                <Select
                  name='category_id'
                  required={true}
                  label={'Category'}
                  value={formik.values.category_id}
                  options={categoryOptions}
                  onChange={formik.handleChange}
                  error={
                    (formik.touched.category_id && formik.errors.category_id) ||
                    ''
                  }
                />
              </FormControl>

              <FormControl sx={{ m: 2, minWidth: 120 }}>
                <Select
                  name='resolver_id'
                  required={true}
                  label={'Resolver'}
                  value={formik.values.resolver_id}
                  options={userOptions}
                  onChange={formik.handleChange}
                  error={
                    (formik.touched.resolver_id && formik.errors.resolver_id) ||
                    ''
                  }
                />
              </FormControl>
              <UploadBucket
                isLoading={isLoading}
                file={file}
                value={formik.values.asset_url}
                name={'asset_url'}
                handleChange={(e) => {
                  handleChangeFile(e);
                }}
                removeFile={removeFile}
              />
              <Button
                type='submit'
                className='mx-3'
                style={{ height: '40px' }}
                isLoading={creatingTicket}
              >
                Create
              </Button>
            </div>
          </form>
          <br />
        </Paper>
      </div>
    </>
  );
};

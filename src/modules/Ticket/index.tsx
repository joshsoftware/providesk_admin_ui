import { useMemo, useState, useContext } from 'react';
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
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select as SelectMUI,
  TextField,
  Typography,
} from '@mui/material';
import { UploadBucket } from 'modules/shared/UploadBucket';
import { s3GetSignedUrlForPath, s3Upload } from 'apis/utils/mediaUpload/awsmedia';


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
    },
    validationSchema: ValidationSchema,
    onSubmit: (values) => {
      createTicket(values);
      formik.resetForm();
    },
  });

  
  return (
    <>
      <div
        style={{
          margin: '3rem 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={2} sx={{ paddingTop: 3, minWidth: '20rem' }}>
          <Divider>
            <Typography variant='h6' component='div'>
              Create Request or Complaint
            </Typography>
          </Divider>
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
                color='secondary'
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                autoFocus={true}
                helperText={formik.touched.title && formik.errors.title}
              />
              <Typography variant='caption' style={{ margin: '0 1rem' }}>
                {' '}
                Description *{' '}
              </Typography>
              <textarea
                style={{
                  margin: '0 1rem',
                  border: '0',
                  borderBottom: '1px solid',
                  whiteSpace: 'pre-wrap',
                  outline: 'none',
                }}
                name='description'
                rows={3}
                value={formik.values.description}
                required={true}
                color='secondary'
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
               <UploadBucket />
                <Button onClick={()=>
                s3GetSignedUrlForPath("Screenshot from 2022-09-20 19-50-21.png")
                .then((e)=>console.log("message",e))
                .catch(e=>console.log(e))}>Buttton</Button>
              <Button type='submit' className='mx-3' style={{ height: '40px' }}>
                Create
              </Button>
              <a href="https://providesk-media.s3.ap-south-1.amazonaws.com/Screenshot%20from%202022-09-20%2019-50-21%20%284%29.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVOPE4M6SDPSLDX6U%2F20221130%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20221130T050752Z&X-Amz-Expires=21600&X-Amz-Signature=6590ea8212bdb5a13f2fa1f1a2a09c2dbda3e49daddbdc369a3e7b0338c1cb88&X-Amz-SignedHeaders=host">Link</a>
            </div>
          </form>
          <br />
        </Paper>
      </div>
    </>
  );
};

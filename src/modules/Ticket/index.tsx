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
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select as SelectMUI,
  TextField,
  Typography,
} from '@mui/material';
import Loader from 'modules/Auth/components/Loader';

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
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1', p: '1.5rem' }}>
      <Loader
        isLoading={
          isFetchingDepartments ||
          isFetchingCategories ||
          isFetchingUsers ||
          creatingTicket
        }
      />
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant='h5'>Create Request or Complaint</Typography>
      </Box>

      <Paper elevation={2} sx={{ padding: 3 }}>
        <Box component='form' onSubmit={formik.handleSubmit}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', rowGap: 3, columnGap: 4 }}>
            <TextField
              label='Title'
              name='title'
              minRows={3}
              value={formik.values.title}
              type='text'
              required={true}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              FormHelperTextProps={{ sx: { fontSize: '0.875rem', p: '0.125rem 0.875rem 0 0.875rem', m: 0 } }}
            />
            <Box sx={{ display: 'grid' }}>
              <TextField
                label='Description'
                multiline
                name='description'
                value={formik.values.description}
                required={true}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                FormHelperTextProps={{ sx: { fontSize: '0.875rem', p: '0.125rem 0.875rem 0 0.875rem', m: 0 } }}
              />
            </Box>
            <FormControl>
              <Select
                name='ticket_type'
                placeholder='Ticket Type'
                required={true}
                options={ticketTypesList}
                value={formik.values.ticket_type}
                label='Ticket Type'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.ticket_type &&
                  (formik.errors.ticket_type)
                } />
            </FormControl>
            <FormControl>
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
                    formik.errors.department_id)

                }
                onBlur={formik.handleBlur}
              />
            </FormControl>
            <FormControl>
              <Select
                name='category_id'
                required={true}
                label={'Category'}
                value={formik.values.category_id}
                options={categoryOptions}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.category_id && formik.errors.category_id
                }
              />
            </FormControl>
            <FormControl>
              <Select
                name='resolver_id'
                required={true}
                label={'Resolver'}
                value={formik.values.resolver_id}
                options={userOptions}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  (formik.touched.resolver_id && formik.errors.resolver_id)

                }
              />
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'end', pt: 3 }}>
            <Button
              isLoading={creatingTicket}
              type='submit'
            >
              Create
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

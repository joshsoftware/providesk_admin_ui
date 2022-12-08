import { useMemo, useState, useContext, useCallback } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import CloseIcon from '@mui/icons-material/Close';

import { Button } from 'modules/shared/Button';
import Select from 'modules/shared/Select';

import { ticketTypesList } from './ticket.constants';
import { UserContext } from 'App';
import { ICreateTicketData, IEditTicketParams } from './type';
import { useCategories, useDepartments } from 'modules/Category/category.hook';
import { useCreateTicket, useEditTicket, useUsers } from './ticket.hook';

import {
  Box,
  Dialog,
  FormControl,
  IconButton,
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
import { BooleanNullable } from 'aws-sdk/clients/glue';
import { ITicket } from 'modules/details/type';
import { Value } from 'sass';

function Ticket({
  open,
  setOpen,
  data,
  isEdit,
}: {
  open: boolean;
  setOpen: (a: boolean) => void;
  data?: ITicket;
  isEdit: boolean;
}) {
  const { userAuth } = useContext(UserContext);
  const intialValuesEdit = {
    title: data?.title,
    description: data?.description,
    category_id: data?.category_id,
    department_id: data?.department_id,
    ticket_type: data?.ticket_type,
    resolver_id: data?.resolver_id,
    asset_url: data?.asset_url,
  };
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

  const { mutate: updateMutate, isLoading: updateIsLoading } = useEditTicket();

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

  const updateTicket = useCallback((values) => {
    let ticket = values as ICreateTicketData;
    let payload: IEditTicketParams = {
      id: data?.id!,
      ticket_details: {
        ticket: {
          ...ticket,
          title: ticket.title.trim(),
          description: ticket.description.trim(),
        },
      },
      setOpenEdit: setOpen,
    };
    updateMutate(payload);
  }, []);

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

  const handleUpdateAsset = useCallback(
    (setFormikValue, index: number, valuesAsset: string[]) => {
      let asset_val = valuesAsset.filter((item, ind) => index !== ind);
      setFormikValue('asset_url', asset_val);
    },
    []
  );

  const formik = useFormik({
    initialValues: isEdit
      ? intialValuesEdit
      : {
          title: '',
          description: '',
          category_id: '',
          department_id: '',
          ticket_type: '',
          resolver_id: '',
          asset_url: [] as string[],
        },
    validationSchema: ValidationSchema,
    onSubmit: (values) => {
      let { pro, name } = uploadFile(file, setIsLoading);
      Promise.all(pro)
        .then((e) => {
          setIsLoading(false);

          !isEdit
            ? createTicket({ ...values, asset_url: name })
            : updateTicket({
                ...values,
                asset_url: [...(values.asset_url as string[]), ...name],
              });
        })
        .catch((e) => {
          setIsLoading(false);
          console.log(e, 'error');
          toast.error('unable to upload image');
        });
    },
  });

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth='xs'
      open={open}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1',
          p: '1.5rem',
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
        <Box
          sx={{
            px: 3,
            mb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant='h5'>
            {!isEdit ? 'Create Request or Complaint' : 'Edit  Ticket'}
          </Typography>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon fontWeight={'bold'} />{' '}
          </IconButton>
        </Box>

        <Paper elevation={2} sx={{ padding: 3 }}>
          <Box component='form' onSubmit={formik.handleSubmit}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                rowGap: 3,
                columnGap: 4,
              }}
            >
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
                FormHelperTextProps={{
                  sx: {
                    fontSize: '0.875rem',
                    p: '0.125rem 0.875rem 0 0.875rem',
                    m: 0,
                  },
                }}
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
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                  FormHelperTextProps={{
                    sx: {
                      fontSize: '0.875rem',
                      p: '0.125rem 0.875rem 0 0.875rem',
                      m: 0,
                    },
                  }}
                />
              </Box>
              <FormControl>
                <Select
                  name='ticket_type'
                  placeholder='Ticket Type'
                  required={true}
                  options={ticketTypesList}
                  value={formik.values.ticket_type!}
                  label='Ticket Type'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.ticket_type && formik.errors.ticket_type
                  }
                />
              </FormControl>
              <FormControl>
                <Select
                  name='department_id'
                  required={true}
                  label={'Department'}
                  value={formik.values.department_id!}
                  options={deptOptions}
                  onChange={(e) => {
                    setDepartmentId(parseInt(e.target.value));
                    formik.values.category_id = '';
                    formik.values.resolver_id = '';
                    formik.handleChange(e);
                  }}
                  error={
                    formik.touched.department_id && formik.errors.department_id
                  }
                  onBlur={formik.handleBlur}
                />
              </FormControl>
              <FormControl>
                <Select
                  name='category_id'
                  required={true}
                  label={'Category'}
                  value={formik.values.category_id as string}
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
                  value={formik.values.resolver_id!}
                  options={userOptions}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.resolver_id && formik.errors.resolver_id
                  }
                />
              </FormControl>
            </Box>
            <UploadBucket
              isLoading={isLoading}
              file={file}
              value={formik.values.asset_url!}
              name={'asset_url'}
              handleChange={handleChangeFile}
              removeFile={removeFile}
            />
            {formik.values.asset_url?.map((item, index) => (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography>{item}</Typography>
                <IconButton
                  onClick={() => {
                    handleUpdateAsset(
                      formik.setFieldValue,
                      index,
                      formik.values.asset_url!
                    );
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'end', pt: 3 }}>
              <Button isLoading={creatingTicket} type='submit'>
                {!isEdit ? 'Create' : 'Update'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Dialog>
  );
}
export default Ticket;

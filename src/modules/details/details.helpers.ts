import * as yup from 'yup';

export const editTicketValidationSchema = yup.object({
  description: yup.string().when('status', {
    is: (status) => status !== 'reopen',
    then: (schema) =>
      schema
        .matches(
          /^[-().,_ A-Za-z0-9@': \n]*$/i,
          'Special characters are not allowed.'
        )
        .required('Comment is required.'),
  }),
  department_id: yup.string().when('status', {
    is: (status) => status !== 'reopen',
    then: (schema) => schema.required('Select department.'),
  }),
  category_id: yup.string().when('status', {
    is: (status) => status !== 'reopen',
    then: (schema) => schema.required('Select ticket category.'),
  }),
  resolver_id: yup.string().when('status', {
    is: (status) => status !== 'reopen',
    then: (schema) => schema.required('Assign ticket to resolver.'),
  }),
  status: yup.string().required('Assign status of ticket'),
  is_customer_satisfied: yup.boolean().when('status', {
    is: 'reopen',
    then: (schema) => schema.default(false).required(),
  }),
  rating: yup.number().when('status', {
    is: 'reopen',
    then: (schema) => schema.required().min(1, 'Required').max(5, 'Required'),
  }),
  state_action: yup.string().when('status', {
    is: 'reopen',
    then: (schema) => schema.default('reopen').required(),
  }),
  started_reason: yup.string().when('status', {
    is: 'reopen',
    then: (schema) => schema.required('Reason to reopen ticket is required.'),
  }),
});

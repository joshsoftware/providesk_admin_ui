import { Typography } from '@mui/material';

export const StyleLabel = ({
  text,
  sx,
  required,
}: {
  text: string;
  sx?: any;
  required?: boolean;
}) => {
  return (
    <>
      <Typography sx={{ sx }}>
        {text}
        {required && '*'}
      </Typography>
    </>
  );
};

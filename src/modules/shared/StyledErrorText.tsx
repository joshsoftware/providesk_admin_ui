import { Typography } from '@mui/material';
export const StyledErrorText = ({ text, sx }: { text: string; sx?: any }) => {
  return (
    <>
      <Typography variant='body1' component='p' sx={{color: 'error.main', p: '0.125rem 0.875rem 0 0.875rem', ...sx}}>
        {text}
      </Typography>
    </>
  );
};

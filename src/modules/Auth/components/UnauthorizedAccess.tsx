import { Box, Card, CardContent, Typography } from '@mui/material';

const UnauthorizedAccess = () => {
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', flex: '1', p: '1.5rem' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant='h5'>Unauthorized Access</Typography>
      </Box>
      <Card sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '1',
            gap: 3,
          }}
        >
          <Box sx={{ p: 3 }}>
            <img
              src='./images/access-denied.svg'
              alt='AccessDenied'
              height={300}
            />
          </Box>
          <Typography variant='subtitle1'>
            You are attempting to access or change data outside of your scope.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UnauthorizedAccess;

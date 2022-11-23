import React from 'react';
import { Box } from '@mui/material';

import Sidebar from './sidebar';

const withLayout = (component: React.ReactElement) => {
  return (
    <>
      <Sidebar />
      <Box sx={{p: '1.5rem', pt: '5.5rem'}}>{component}</Box>
    </>
  );
};

export default withLayout;

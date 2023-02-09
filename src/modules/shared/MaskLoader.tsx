import React from 'react';
import { Box } from '@mui/system';
import { CircularProgress } from '@mui/material';

export const MaskLoader = ({ isLoading }: LoadingMaskProps) => {
  return isLoading ? (
    <Box
      sx={{
        position: 'absolute',
        height: '100%',
        width: '100%',
        background: '#FFFFFF99',
        zIndex: 2000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
      }}
    >
      <CircularProgress color='inherit' />
    </Box>
  ) : null;
};

interface LoadingMaskProps {
  isLoading: boolean | undefined;
}

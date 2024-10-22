import { Button } from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { ReactNode } from 'react';
import './styles.scss';

interface MediaButtonProps {
  handleFunction: () => void;
  children: ReactNode;
}

const MediaButton = ({ handleFunction, children }: MediaButtonProps) => {
  return (
    <Button
      className='custom-button'
      variant='contained'
      startIcon={<VisibilityIcon />}
      onClick={handleFunction}
    >
      {children}
    </Button>
  );
};
export default MediaButton;

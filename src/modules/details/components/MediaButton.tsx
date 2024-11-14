import { Button } from '@mui/material';
import { ReactNode } from 'react';
import './styles.scss';

interface MediaButtonProps {
  handleFunction: () => void;
  children: ReactNode;
  icon: React.ReactNode;
}

const MediaButton = ({ handleFunction, children, icon }: MediaButtonProps) => {
  return (
    <Button
      className='custom-button'
      variant='contained'
      startIcon={icon} 
      onClick={handleFunction}
    >
      {children}
    </Button>
  );
};
export default MediaButton;

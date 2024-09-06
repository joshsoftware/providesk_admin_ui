import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

interface IProps {
  isLoading: boolean;
  top?: string
}

const Loader: React.FC<IProps> = ({ isLoading, top='64' }) => (
  <Backdrop
    sx={{
      color: '#fff',
      zIndex: (theme) => theme.zIndex.drawer + 1,
      top: `${top}px`
    }}
    open={isLoading}
    onClick={() => {}}
  >
    <CircularProgress color='inherit' />
  </Backdrop>
);

export default Loader;

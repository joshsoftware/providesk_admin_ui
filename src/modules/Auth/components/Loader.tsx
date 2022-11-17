import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

interface IProps {
  isLoading: boolean;
}

const Loader: React.FC<IProps> = ({ isLoading }) => (
  <Backdrop
    sx={{
      color: '#fff',
      zIndex: (theme) => theme.zIndex.drawer + 1,
      top: '4rem',
    }}
    open={isLoading}
    onClick={() => {}}
  >
    <CircularProgress color='inherit' />
  </Backdrop>
);

export default Loader;

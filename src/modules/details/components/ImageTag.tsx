import { CircularProgress } from '@mui/material';
import { isLabelWithInternallyDisabledControl } from '@testing-library/user-event/dist/utils';
import { s3GetPresignedUrl} from 'apis/utils/mediaUpload/awsmedia';
import Loader from 'modules/Auth/components/Loader';
import { useEffect, useState } from 'react';

export const ImageS3Tag = ({ path }) => {
  const [srcImg, setSrcImg] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  useEffect(() => {
    setIsLoading(true);
    s3GetPresignedUrl(path)
      .then((img) => {
        setIsLoading(false);
        setSrcImg(img);
      })
      .catch((e) => {
        console.log('unable to fetch', e);
        setIsLoading(false);
      });
  }, []);
  return isLoading ? (
    <CircularProgress />
  ) : (
    <img src={srcImg} alt='Image' width={'200px'} height={'200px'}></img>
  );
};

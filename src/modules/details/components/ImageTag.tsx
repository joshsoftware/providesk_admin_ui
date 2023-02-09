import { CircularProgress } from '@mui/material';
import { s3GetSignedUrlForPath } from 'apis/utils/mediaUpload/awsmedia';
import { useEffect, useState } from 'react';

export const ImageS3Tag = ({ path }) => {
  const [srcImg, setSrcImg] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  useEffect(() => {
    setIsLoading(true);
    s3GetSignedUrlForPath(path)
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
    <a href={srcImg} target='_blank' style={{ display: 'inline-block' }}>
      <img
        src={srcImg}
        alt='Image'
        width={'96px'}
        height={'64px'}
        style={{ border: '1px solid #ccc', borderRadius: '4px' }}
      />
    </a>
  );
};

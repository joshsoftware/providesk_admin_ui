import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { s3GetPresignedUrl } from 'apis/utils/mediaUpload/awsmedia';
import { MediaS3Tagparams } from '../type';
import MediaButton from './MediaButton';

export const MediaS3Tag = ({ path }: MediaS3Tagparams) => {
  const [srcFile, setSrcFile] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
 
  useEffect(() => {
    const fetchPresignedUrl = async () => {
      setIsLoading(true);
      try {
        const assetUrl = await s3GetPresignedUrl(path);
        setSrcFile(assetUrl);
      } catch (e) {
        console.log('Unable to fetch:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPresignedUrl();
  }, [path]);

  const handleDownload = async () => {
    if (srcFile) {
      try {
        const response = await axios.get(srcFile, { responseType: 'blob' });
        const blob = new Blob([response.data]);
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = path.split('/').pop() || 'download';
        link.click();
        window.URL.revokeObjectURL(downloadUrl);
      } catch (error) {
        console.error('Download failed:', error);
      }
    }
  };

  const handleView = () => {
    if (srcFile) {
      window.open(srcFile, '_blank');
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <div>
      {srcFile ? (
        <div>
          <MediaButton handleFunction={handleView} children='View' />
          <MediaButton handleFunction={handleDownload} children='Download' />
        </div>
      ) : (
        <p>Unable to load file</p>
      )}
    </div>
  );
};

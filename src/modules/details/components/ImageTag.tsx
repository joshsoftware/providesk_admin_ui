import axios from 'axios';
import { useQuery } from 'react-query';
import { CircularProgress } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import { s3GetPresignedUrl } from 'apis/utils/mediaUpload/awsmedia';
import MediaButton from './MediaButton';
import { MediaS3Tagparams } from '../type';

export const MediaS3Tag = ({ path }: MediaS3Tagparams) => {
  const { data: srcFile, isLoading, error } = useQuery(['presignedUrl', path], () => s3GetPresignedUrl(path), { 
    enabled: !!path,
  });

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
          <MediaButton handleFunction={handleView} children='View' icon={<VisibilityIcon />} />
          <MediaButton handleFunction={handleDownload} children='Download' icon={<DownloadIcon />} />
        </div>
      ) : (
        <p>Unable to load file</p>
      )}
    </div>
  );
};

import { CircularProgress } from '@mui/material';
import { isLabelWithInternallyDisabledControl } from '@testing-library/user-event/dist/utils';
import { s3GetPresignedUrl} from 'apis/utils/mediaUpload/awsmedia';
import Loader from 'modules/Auth/components/Loader';
import { useEffect, useState } from 'react';

export const MediaS3Tag = ({ path }: { path: string }) => {
  const [srcFile, setSrcFile] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [fileType, setFileType] = useState<string | undefined>();

  useEffect(() => {
    setIsLoading(true);
    s3GetPresignedUrl(path)
      .then((assetUrl) => {
        setIsLoading(false);
        setSrcFile(assetUrl);
        const baseUrl = assetUrl.split('?')[0]; 
        const extension = baseUrl.split('.').pop()?.toLowerCase(); 

        if (extension === 'pdf') {
          setFileType('pdf');
        } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
          setFileType('image');
        } else if (['xls', 'xlsx'].includes(extension)) {
          setFileType('excel'); 
        } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
          setFileType('video'); 
        } else {
          setFileType('unsupported'); 
        }
      })
      .catch((e) => {
        console.log('unable to fetch', e);
        setIsLoading(false);
      });
  }, [path]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (fileType === 'pdf') {
    return (
      <img 
        src="/images/pdf.png" 
        alt="PDF Thumbnail" 
        width="50px" 
        height="50px" 
        onClick={() => window.open(srcFile, '_blank')} 
        style={{ cursor: 'pointer' }} 
      />
    );
  } else if (fileType === 'image') {
    return (
      <img 
        src={srcFile} 
        alt="File" 
        width="200px" 
        height="200px" 
      />
    );
  } else if (fileType === 'excel') {
    return (
      <img 
        src="/images/sheets.png" 
        alt="Excel Thumbnail" 
        width="50px" 
        height="50px" 
        onClick={() => window.open(srcFile, '_blank')} 
        style={{ cursor: 'pointer' }} 
      />
    );
  } else if (fileType === 'video') {
    const videoType = srcFile?.split('.').pop()?.toLowerCase() === 'mp4' ? 'video/mp4' : 'video/webm'; 
    return (
      <video
        width="400" 
        controls 
        style={{ cursor: 'pointer' }}>
        <source src={srcFile} type={videoType} />
        Your browser does not support the video tag.
      </video>
    );
  } else {
    return <p>Unsupported file type</p>;
  }
};

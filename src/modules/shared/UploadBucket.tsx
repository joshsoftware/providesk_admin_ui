import { Button } from './Button';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Box } from '@mui/system';
import { IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { ALLOWED_TYPES, MAX_FILE_SIZE } from './constants';

export const UploadBucket = ({
  isLoading,
  file,
  handleChange,
  removeFile,
  value,
  name,
  error,
}: {
  isLoading: boolean;
  file: File[];
  name: string;
  value: string[];
  handleChange: (a: File[]) => void;
  removeFile: (a: number) => void;
  error?: string;
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onChangeFile = (files: FileList) => {
    const selectedFiles = Array.from(files);

    const invalidFile = selectedFiles.find(file => !ALLOWED_TYPES.includes(file.type));
    
    if (invalidFile) {
      setErrorMessage(`Invalid file type: ${invalidFile.name}`);
      return;
    }

    const oversizedFile = selectedFiles.find((file) => file.size > MAX_FILE_SIZE);

    if (oversizedFile) {
      setErrorMessage(`File exceeds size limit: ${oversizedFile.name}`);
      return;
    }

    setErrorMessage(null); 
    handleChange(selectedFiles); 
  };

  return (
    <Box>
      <input
        style={{ display: 'none' }}
        type='file'
        accept={ALLOWED_TYPES.join(',')} 
        id={'id'} 
        onChange={(e) => {
          const files = e.target.files; 
          if (files && files.length > 0) { 
            onChangeFile(files); 
          }
        }}
      />
      <label htmlFor='id'>
        <Button
          variant='contained'
          component='span'
          isLoading={isLoading}
          startIcon={<FileUploadIcon />}
        >
          Upload
        </Button>
      </label>
      {errorMessage && ( 
        <Typography color="error" sx={{ mt: 1 }}>
          {errorMessage}
        </Typography>
      )}
      {file?.map((item, index) => (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography>{item.name}</Typography>
          <IconButton onClick={() => removeFile(index)}>
            <CloseIcon />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
};

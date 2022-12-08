import { Button } from './Button';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Box } from '@mui/system';
import { IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
  const onChangeFile = (e) => {
    handleChange(e);
  };

  return (
    <Box>
      <input
        style={{ display: 'none' }}
        type='file'
        id={'id'}
        onChange={(e) => {
          if (e.target.files?.length! > 0) {
            onChangeFile(e.target.files);
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

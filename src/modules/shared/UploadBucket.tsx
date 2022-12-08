import { Box } from '@mui/system';
import { IconButton, Typography } from '@mui/material';
import {
  AttachmentRounded,
  CloseRounded,
  FileUploadRounded,
} from '@mui/icons-material';

import { Button } from './Button';

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
    <Box
      display={'grid'}
      gap={2}
      p={2}
      borderColor={'grey.400'}
      borderRadius={1}
      sx={{ backgroundColor: 'grey.100' }}
    >
      <Box textAlign={'center'}>
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
            fullWidth
            variant='text'
            component='span'
            isLoading={isLoading}
            startIcon={<FileUploadRounded />}
          >
            Upload
          </Button>
        </label>
      </Box>
      {file?.map((item, index) => (
        <Box
          display={'flex'}
          alignItems={'center'}
          gap={3}
          pl={3}
          pr={2}
          py={1}
          border={1}
          borderColor={'grey.400'}
          borderRadius={1}
          sx={{ backgroundColor: 'primary.light' }}
        >
          <Box display={'flex'} alignItems={'center'} gap={2} mr={'auto'}>
            <AttachmentRounded sx={{ fontSize: 16 }} />
            <Typography
              variant='body2'
              flex={1}
              overflow={'hidden'}
              textOverflow={'ellipsis'}
              whiteSpace={'nowrap'}
            >
              {item.name}
            </Typography>
          </Box>
          <IconButton onClick={() => removeFile(index)} sx={{ p: 1 }}>
            <CloseRounded sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
};

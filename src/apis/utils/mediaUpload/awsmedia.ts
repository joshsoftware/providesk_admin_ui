import { post } from 'apis/apiHelper';
import AWS from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import axios from 'axios';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRECT_KEY,
});

export const s3GetSignedUrlForPath = async (fileName) => {
  try {
    const payload = {
      path: '/tickets/create_presigned_url', 
      requestParams: {
        object_key: fileName,
      },
    };
    const response = await post(payload);
    return response.data.url;
  } catch (error) {
    console.error('Error getting presigned URL: ', error);
    throw error;
  }
};

export const s3Upload= async (file: File, presignedUrl: string) => {
  try {
    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
        'Content-Length': file.size
      },
    });
  } catch (error) {
    console.error("Error uploading file to S3: ", error);
    throw error;
  }
}

export const uploadFile = async (
  files: File[],
  setIsLoading: (a: boolean) => void
) => {
  setIsLoading(true);
  const date = moment().format('DD-MM-YYYY');
  const fileNames: string[] = [];

  const uploadPromises = files.map(async (file) => {
    const fileName: string = file.name;
    const fileExtension: string = fileName.substring(fileName.lastIndexOf('.'));
    const uniqueFileName: string = uuidv4() + date + fileExtension;  
    try {
      const presignedUrl = await s3GetSignedUrlForPath(uniqueFileName);
      await s3Upload(file, presignedUrl);
      fileNames.push(uniqueFileName); 
    } catch (error) {
      console.error(`Error uploading file ${fileName}: `, error);
    }
  });

  try {
    await Promise.all(uploadPromises); 
  } catch (error) {
    console.error("file uploads failed:", error);
  } finally {
    setIsLoading(false); 
  }

  return fileNames; 
};

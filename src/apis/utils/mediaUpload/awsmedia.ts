import {post } from 'apis/apiHelper';
import AWS from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import axios from 'axios';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';


export const s3PostPresignedUrl = async (fileName) => {
  try {
    const payload = {
      path: '/tickets/create_presigned_url', 
      queryParams: {
        object_key: fileName,
        method: 'put',
      },
    };
    const response = await post(payload);
    return response.data.url;
  } catch (error) {
    console.error('Error getting presigned URL: ', error);
    throw error;
  }
};

export const s3GetPresignedUrl = async (objectKey) => {
  try {
    const payload = {
      path: '/tickets/create_presigned_url',
      queryParams: {
        object_key: objectKey,
        method: 'get',
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
  let pro: Promise<PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>>[] = [];
  let name: string[] = [];
  const date = moment().format('DD-MM-YYYY');
  const fileNames: string[] = [];

  const uploadPromises = files.map(async (file) => {
    const fileName: string = file.name;
    const fileExtension: string = fileName.substring(fileName.lastIndexOf('.'));
    const uniqueFileName: string = uuidv4() + date + fileExtension;  
    try {
      const presignedUrl = await s3PostPresignedUrl(uniqueFileName);
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

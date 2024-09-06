import AWS from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { REACT_APP_AWS_ACCESS_KEY, REACT_APP_AWS_REGION, REACT_APP_AWS_SECRECT_KEY, REACT_APP_S3_BUCKET_NAME } from 'env';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

AWS.config.update({
  region: REACT_APP_AWS_REGION,
  accessKeyId: REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: REACT_APP_AWS_SECRECT_KEY,
});

export const s3GetSignedUrlForPath = (path: any) => {
  const s3Bucket = new AWS.S3({
    region: REACT_APP_AWS_REGION,
    params: {
      Bucket: REACT_APP_S3_BUCKET_NAME,
      region: REACT_APP_AWS_REGION,
    },
  });

  const data = {
    Key: path,
    Expires: 21600,
  };

  return s3Bucket.getSignedUrlPromise('getObject', data);
};

export const s3Upload = async (base64Obj: any, path: any) => {
  const s3Bucket = new AWS.S3({
    params: {
      Bucket: REACT_APP_S3_BUCKET_NAME,
      region: REACT_APP_AWS_REGION,
    },
  });

  const data: AWS.S3.PutObjectRequest = {
    Key: path,
    Body: base64Obj,
    Bucket: REACT_APP_S3_BUCKET_NAME as string,
    ContentType: base64Obj.type,
  };
  return s3Bucket.putObject(data).promise();
};

export const uploadFile = (
  file: File[],
  setIsLoading: (a: boolean) => void
) => {
  let pro: Promise<PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>>[] = [];
  let name: string[] = [];
  const date = moment().format('DD-MM-YYYY');
  setIsLoading(true);
  for (let i = 0; i < file.length; i++) {
    let fileName: string = file[i].name;
    let fileExtension: string = fileName.substring(fileName.lastIndexOf('.'));
    name[i] = uuidv4() + date + fileExtension;
    pro.push(s3Upload(file[i], name[i]));
  }
  return { pro, name };
};

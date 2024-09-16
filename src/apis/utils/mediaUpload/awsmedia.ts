import AWS from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRECT_KEY,
});

export const s3GetSignedUrlForPath = (path) => {
  const s3Bucket = new AWS.S3({
    region: process.env.REACT_APP_AWS_REGION,
    params: {
      Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
      region: process.env.REACT_APP_AWS_REGION,
    },
  });

  const data = {
    Key: "providesk-stage/"+path,
    Expires: 21600,
  };

  return s3Bucket.getSignedUrlPromise('getObject', data);
};

export const s3Upload = async (base64Obj, path) => {
  const s3Bucket = new AWS.S3({
    params: {
      Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
      region: process.env.REACT_APP_AWS_REGION,
    },
  });

  const data: AWS.S3.PutObjectRequest = {
    Key: path,
    Body: base64Obj,
    Bucket: process.env.REACT_APP_S3_BUCKET_NAME as string,
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
    pro.push(s3Upload(file[i], "providesk-stage/"+name[i]));
  }
  return { pro, name };
};

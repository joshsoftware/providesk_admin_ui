import AWS from 'aws-sdk';

import { uploadFile } from 'react-s3';
AWS.config.update({ 
  region:"ap-south-1",
  accessKeyId:"AKIAVOPE4M6SDPSLDX6U",
  secretAccessKey:"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"})

// const config = {
//   bucketName: process.env.REACT_APP_S3_BUCKET_NAME ,
//   region: "ap-south-1",
//   accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
//   secretAccessKey: process.env.REACT_APP_AWS_SECRECT_KEY 
//   ,
// }
export const s3GetSignedUrlForPath = (path) => {
    const s3Bucket = new AWS.S3({
      region: "ap-south-1",
      params: { Bucket: process.env.REACT_APP_S3_BUCKET_NAME ,region:"ap-south-1"},
    });
  
    const data = {
      Key: path,
      Expires: 21600,
    };
  
    return s3Bucket.getSignedUrlPromise('getObject', data);
  };

export const s3Upload = async (base64Obj, path) => {
    console.log("in function path 19",path)
    
    const s3Bucket = new AWS.S3({
        params: {
        Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
        region: process.env.REACT_APP_AWS_REGION ,
      },
    });
 
  
    const data:AWS.S3.PutObjectRequest = {
      Key: path,
      Body: base64Obj,
      Bucket:process.env.REACT_APP_S3_BUCKET_NAME,
      ACL:'public-read',
      "Content-Type":"image/*"
      
    };
  console.log(data,"in s3bucket",s3Bucket)
    return s3Bucket.putObject(data).promise();
  
  };

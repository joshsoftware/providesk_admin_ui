import { Button } from "./Button";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Box } from "@mui/system";
import { s3Upload } from "apis/utils/mediaUpload/awsmedia";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Typography } from "@mui/material";

export const UploadBucket = ()=>{
      const [error,setError] = useState<React.ErrorInfo|undefined>()
      const [fileName,setFileName] = useState<string>();
      const [isLoading,setIsLoading] = useState<boolean>(false)
      const onChangeFile = (file)=>{
        console.log("call function",file[0],file[0].name)
        setIsLoading(true);
        setFileName(file[0].name);
        s3Upload(file[0],file[0].name)
        .then((e)=>{
          toast.success("Upload successfully");
          console.log(e,"this is upload")
          setIsLoading(false);
        })
        .catch((e)=>{
          setIsLoading(false);
          toast.error("unable to Upload")
          console.log(e);
        })
      }

    return (<Box>
    <input style={{ display: 'none' }}
          type="file"
          id={'id'}
          onChange={(e) => {
            if (e.target.files?.length! > 0) {
              onChangeFile(e.target.files);
            }
          }}/>
          <label htmlFor="id">
          <Button
            variant="contained"
            component="span"
            startIcon={<FileUploadIcon />}
            isLoading={isLoading}
          >
            Upload
          </Button>
          <Typography>{fileName||""}</Typography>
        </label>
    </Box>)
}
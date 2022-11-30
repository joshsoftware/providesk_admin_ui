import React , {useState} from 'react';
import { uploadFile } from 'react-s3';
import { Buffer } from 'buffer';

// @ts-ignore
window.Buffer = Buffer;

const S3_BUCKET ="providesk-media"
const REGION ="ap-south-1"
const ACCESS_KEY ="AKIAVOPE4M6SDPSLDX6U"
const SECRET_ACCESS_KEY ="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"

const config = {
    bucketName: S3_BUCKET,
    region: REGION,
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
}

export const UploadImageToS3WithReactS3 = () => {

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
    }

    const handleUpload = async (file) => {
        uploadFile(file, config)
            .then(data => console.log(data))
            .catch(err => console.error(err))
    }

    return <div>
        <div>React S3 File Upload</div>
        <input type="file" onChange={handleFileInput}/>
        <button onClick={() => handleUpload(selectedFile)}> Upload to S3</button>
    </div>
}
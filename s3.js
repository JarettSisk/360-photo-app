require("dotenv").config();
const fs = require("fs");
const S3 = require("aws-sdk/clients/s3");

const s3Bucket = process.env.AWS_BUCKET_NAME;
const AWSRegion = process.env.AWS_BUCKET_REIGION;
const AWSAccessKey = process.env.AWS_ACCESS_KEY_ID;
const AWSSecretKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3({
  AWSRegion,
  AWSAccessKey,
  AWSSecretKey
})

// function to upload a photo to s3
function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);

  let uploadParams = {
    Bucket: s3Bucket,
    Body: fileStream,
    ContentType: file.mimetype,
    Key: file.filename
  }

  return s3.upload(uploadParams).promise();
}

// function to delete a photo from out bucket
function deleteFile(key) {
  console.log(key);
  let params = {
    Bucket: s3Bucket,
    Key: key
  }

  return s3.deleteObject(params).promise();
}

// function to get a photo from s3
const getPhotoUrl = (fileName) => {
  const signedUrlExpireSeconds = 60 * 60

  const url = s3.getSignedUrl('getObject', {
      Bucket: s3Bucket,
      Key: fileName,
      Expires: signedUrlExpireSeconds
  })
  return url;
}

module.exports = { uploadFile, deleteFile, getPhotoUrl };





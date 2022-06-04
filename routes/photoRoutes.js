const express = require("express");
const router = new express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const fs = require("fs");
// get all the photo urls on startup from mock db
const photos = require('../photo_url_data.json');

const { uploadFile, getPhotoUrl } = require("../s3");
const { savePhotoUrl } = require("../helpers/jsonHelpers");



// GET photo all photos
router.get("/", function(req, res, next) {
  // -TODO fix this so that it return error to client
  try {
      return res.send(photos);
  } catch (error) {
    next(error); 
  }
});

// POST photo - render the photo upload form template
router.get("/add", function(req, res, next) {

  return res.render("addPhotoForm.html");
});

// POST photo - upload a new photo to the S3 bucket
router.post('/add', upload.single('image'), async function (req, res, next) {
  try {
    // Our image file
  const file = req.file;
  // upload to AWS s3
  const result = await uploadFile(file)
  // Create a new pre-signed url for storage
  const signedUrl = await getPhotoUrl(result.key);
  // save the url to our mock database
  savePhotoUrl({photo_url: signedUrl});
  // since the mock data is only fetched on server startup, we push the data manually to update without startup.
  photos.push({photo_url: signedUrl});
  let message;
  if(result) {
    message = "Photo sucessfully added";
  } else {
    message = "Error, photo could not be added";
  }
  // Remove image data from server after uploading;
  fs.unlinkSync(req.file.path);
  res.render("addPhotoForm.html", {message});
  } catch (error) {
    next(error);
  }
  
})


module.exports = router;
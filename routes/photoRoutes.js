const express = require("express");
const router = new express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const fs = require("fs");
// get all the photo urls on startup from mock db
let photos = require('../photo_url_data.json');
// Image paths for demo version
const photosDemo = ["/images/room1.jpg", "/images/room2.jpg"]

const { uploadFile, getPhotoUrl, deleteFile } = require("../s3");
const { savePhoto, deletePhoto } = require("../helpers/jsonHelpers");



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
  console.log(file);
  // upload to AWS s3
  const result = await uploadFile(file)
  console.log(result);
  // Create a new pre-signed url for storage
  const signedUrl = await getPhotoUrl(result.Key);
  // save the url to our mock database
  savePhoto({key: result.Key, photo_url: signedUrl});
  // since the mock data is only fetched on server startup, we push the data manually to update without startup.
  photos.push({key: result.Key, photo_url: signedUrl});
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

router.post('/delete',async (req, res, next) => {
  try {

    const result = await deleteFile(req.body.key);

    deletePhoto({key: req.body.key, photo_url: req.body.photo_url});
    photos = photos.filter(photo => photo.key !== req.body.key);
    return res.send(result);
    
  } catch (error) {
    next(error);
  }

})

// GET all demo photos 
router.get("/demo", function(req, res, next) {
  // -TODO fix this so that it return error to client
  try {
      return res.send(photosDemo);
  } catch (error) {
    next(error); 
  }
});


module.exports = router;
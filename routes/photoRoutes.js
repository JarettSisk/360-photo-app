const express = require("express");
const router = new express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const fs = require("fs");
const { SECRET_KEY } = require("../config");
// get all the photo urls on startup from mock db
let photos = require('../photo_url_data.json');
// Image paths for demo version
const photosDemo = ["/images/room1.jpg", "/images/room2.jpg"]

const { uploadFile, getPhotoUrl, deleteFile } = require("../s3");
const { savePhoto, deletePhoto, getPhotos } = require("../helpers/jsonHelpers");

// GET /photo - render addPhotoForm template
router.get("/", function(req, res) {
  return res.render("addPhotoForm.html");
});

// GET /photo/get - get all photos
router.get("/get", function(req, res, next) {
  try {
      // get photos and set the returning value to our photos var
      photos = getPhotos();
      return res.send(photos);
  } catch (error) {
    next(error); 
  }
});

// POST /photo - upload a new photo to the S3 bucket
router.post('/', upload.single('image'), async function (req, res, next) {
  try {
    if(req.body.password !== SECRET_KEY) {
      // delete multed image file
      fs.unlinkSync(req.file.path);
      return res.status(401).send({message: "Invalid password. Please see admin."});
    }
    // Our image file
    const file = req.file;
    // upload to AWS s3
    const result = await uploadFile(file)

    if(result) {
      // Create a new pre-signed url to store
      const signedUrl = await getPhotoUrl(result.Key);
      // store the url to our mock database
      savePhoto({key: result.Key, photo_url: signedUrl});
      photos = getPhotos();
      fs.unlinkSync(req.file.path);
      return res.send(result);
    }
  } catch (error) {
    next(error);
  }
})

// DELETE /photo - delete a photo from the s3 bucket, and from out mock DB.
router.delete('/',async (req, res, next) => {
  try {
    const result = await deleteFile(req.body.key);
    deletePhoto({key: req.body.key, photo_url: req.body.photo_url});
    photos = getPhotos();
    return res.send(result);
    
  } catch (error) {
    next(error);
  }

})

// GET /photos/demo - get all demo photos 
router.get("/demo", function(req, res, next) {
  // -TODO fix this so that it return error to client
  try {
      return res.send(photosDemo);
  } catch (error) {
    next(error); 
  }
});

module.exports = router;
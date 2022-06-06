const express = require("express");
const router = new express.Router();
// get all the photo urls on startup from mock db
const { getPhotos } = require('../helpers/jsonHelpers');

// Image paths for demo version
const photosDemo = ["/images/room1.jpg", "/images/room2.jpg"]


// GET template for viewing
router.get("/", function(req, res, next) {
  try {
    let photos = getPhotos();

    if(photos.length > 0) {

      return res.render("viewer.html");

    } else {
      let error = new Error("please add photos to view them");
      error.status = 404;
      throw error;
      
    }
  } catch (error) {
    next(error); 
  }

});

// GET template for viewing
router.get("/demo", function(req, res, next) {
  try {
    if(photosDemo.length > 0) {
      return res.render("viewerDemo.html");

    } else {
      throw new Error("please add photos to view them")
    }
  } catch (error) {
    next(error); 
  }

});





module.exports = router;
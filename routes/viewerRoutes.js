const express = require("express");
const router = new express.Router();
// get all the photo urls on startup from mock db
const { getPhotos } = require('../helpers/jsonHelpers');

// GET /viewer - get template for viewing
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

// GET /viewer/demo - get template for viewing demo
router.get("/demo", function(req, res, next) {
  try {
      return res.render("viewerDemo.html");
  } catch (error) {
    next(error); 
  }
});

module.exports = router;
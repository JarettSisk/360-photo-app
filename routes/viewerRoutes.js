const express = require("express");
const router = new express.Router();
// get all the photo urls on startup from mock db
const photos = require('../photo_url_data.json');

// GET template for viewing
router.get("/", function(req, res, next) {
  try {
    if(photos.length > 0) {
      return res.render("viewer.html");

    } else {
      throw new Error("please add photos to view them")
    }
  } catch (error) {
    next(error); 
  }

});





module.exports = router;
const express = require("express");
const router = new express.Router();

// GET template for viewing
router.get("/", function(req, res, next) {

  return res.render("viewer.html");

});





module.exports = router;
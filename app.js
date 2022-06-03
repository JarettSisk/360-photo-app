"use strict";

/** Express app. */
const path = require('path')
const express = require("express");
const cors = require("cors");

// templating language
const nunjucks = require('nunjucks');

const app = express();

app.use(cors());
app.use(express.json());

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// three js paths
app.use('./build/', express.static('node_modules/three/build'));
app.use('./jsm/', express.static('node_modules/three/examples/jsm'));

app.use(express.static(path.join('public')))


// ROUTES

// --TODO add additional routes are we reach milestones in functionality

// GET list of albums
app.get('/albums', function(req, res) {
  // mock data
  let albums = [{id: 1, album_title: "album 1"}, {id: 2, album_title: "album 2"}]
    return res.render('albums.html', {albums});
});

// GET template for viewing
app.get("/albums/view/:album_id", function(req, res, next) {

  // --TODO: extract the query parameter, and use it in the database query, to only get photos with the matching album_id.
  // mock data
  let photos = [{id: 1, photo_url: "room1.jpg", album_id: 1}, {id: 1, photo_url: "room2.jpg", album_id: 1}];
  let arr = [1,2,3,4]
  console.log(__dirname)
    return res.render("viewer.html", {arr});
  
});

// GET photos from album and view them
app.get("/albums/view/:album_id/photos", function(req, res, next) {

  // --TODO: extract the query parameter, and use it in the database query, to only get photos with the matching album_id.
  // mock data
  let photos = [{id: 1, photo_url: "room1.jpg", album_id: 1}, {id: 1, photo_url: "room2.jpg", album_id: 1}];
  console.log(__dirname)
    return res.send(photos);
});




/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
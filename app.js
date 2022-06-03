"use strict";

/** Express app. */
const path = require('path')
const express = require("express");
const cors = require("cors");
// templating language
const nunjucks = require('nunjucks');

const app = express();
app.use(express.static(path.join('public')))
app.use(cors());
app.use(express.json());

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// three js paths
app.use('./build/', express.static('node_modules/three/build'));
app.use('./jsm/', express.static('node_modules/three/examples/jsm'));



// ROUTES
const viewerRoutes = require("./routes/viewerRoutes");
const photoRoutes = require("./routes/photoRoutes");

app.use('/viewer', viewerRoutes);
app.use('/photo', photoRoutes);







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
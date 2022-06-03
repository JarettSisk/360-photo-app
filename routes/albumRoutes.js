// - NOTE: for now, we are going to only incorporate the ability to upload images so S3, and then get those file urls back for veiwing.
// - The functionality for users, albums, and photo URLS on a postgress DB will come only after I familiarize myself with how S3 works.

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
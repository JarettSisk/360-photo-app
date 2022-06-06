const fs = require("fs");

function getPhotos() {
  let data = fs.readFileSync('./photo_url_data.json', 'utf8'); 
  return JSON.parse(data);
}

// function to store new photo in our json file
function savePhoto(item, path = './photo_url_data.json'){
  if (!fs.existsSync(path)) {
      fs.writeFile(path, JSON.stringify([item]), function(err, result) {
        if(err) console.log('error', err);
      });
  } else {
      let data = fs.readFileSync(path, 'utf8');  
      let list = (data.length) ? JSON.parse(data): [];
      if (list instanceof Array) list.push(item)
      else list = [item]  
      fs.writeFileSync(path, JSON.stringify(list));
  }
  return "test";
}

// function to store new photo in our json file
function deletePhoto(item, path = './photo_url_data.json'){
  let data = fs.readFileSync(path, 'utf8');
  let json = JSON.parse(data);
  json = json.filter((obj) => {
    return obj.key !== item.key });
  fs.writeFileSync(path, JSON.stringify(json, null, 2));
}

module.exports = { savePhoto, deletePhoto, getPhotos };
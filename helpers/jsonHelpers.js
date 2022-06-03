const fs = require("fs");

// function to store new photo in our json file
function savePhotoUrl(item, path = './photo_url_data.json'){
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


exports.savePhotoUrl = savePhotoUrl
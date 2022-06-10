
// Elements
const photoListEl = document.querySelector('.photo-list');
const messageEl = document.querySelector(".message");
const addPhotoForm = document.querySelector(".add-photo-form");

// event listiner function for adding a new photo
addPhotoForm.addEventListener("submit", async (e) => {
  e.preventDefault()
  const formData = new FormData(addPhotoForm);
  // add a loading message into the error popup
  messageEl.innerText = "Uploading...";
  // send the request to our server to add the photo
  try {
    const response = await axios.post(`/photo`, formData,  {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    })
    if(response)
      messageEl.innerText = "Photo successfully uploaded";
      appendPhotos()
      addPhotoForm.reset();
  } catch (error) {
    err = error.response; 
    console.log(err.status); // log status code
    console.log(err.data.message); // log message
    messageEl.innerText = err.data.message; // show message on page
  }
})

// Function to create the DOM element for a photo.
function createPhotoDom(key, photo_url) {
  
  const photoLi = document.createElement('li');
  const photoImg = document.createElement("img");
  photoImg.classList.add("photo");
  photoImg.setAttribute('key', key);
  photoImg.setAttribute('src', photo_url);
  photoLi.classList.add('photo-li');


  const removeBtnForm = document.createElement('form');
  removeBtnForm.classList.add('remove-btn-form');
  removeBtnForm.setAttribute('method', 'POST');

  const removeBtn = document.createElement('button');
  removeBtn.classList.add('remove');
  removeBtn.innerText = 'X';
  removeBtn.setAttribute('type', 'submit');
  
  // Listener for remove photo buttons
  removeBtnForm.addEventListener("submit", async function(e) {
    e.preventDefault()
    await axios.delete(`/photo`, { data: {
        key,
        photo_url
        } })
      .then(function (response) {
        messageEl.innerText = "Photo successfully deleted";
      })
      .catch(function (error) {
        console.log(error);
      });
    removeBtnForm.parentElement.remove();
  })

  photoLi.appendChild(photoImg);
  removeBtnForm.appendChild(removeBtn);
  photoLi.prepend(removeBtnForm);
  
  return photoLi;
}

// Append photos to our photo list
async function appendPhotos() {
  photoListEl.innerHTML = "";
  try {
    const response = await axios.get(`/photo/get`);
    photos = response.data;
    for(photo of photos) {
        photoEl = createPhotoDom(photo.key, photo.photo_url)
        photoListEl.append(photoEl);
    }
  } catch (error) {
    console.error(error);
  }
}

// initial call
appendPhotos()


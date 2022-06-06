
console.log("test")
// show loading when button is clicked
const addPhotoErrorEl = document.querySelector(".add-photo-loading");
// on page reload, init to empty
addPhotoErrorEl.innerText = "";
const addPhotoButton = document.querySelector(".add-photo-button");

addPhotoButton.addEventListener("click", (e) => {
  // add a loading message into the error popup
  addPhotoErrorEl.innerText = "Uploading...";
})

// we need to get the photos,
// for each photo create <li><form class="remove-photo-form" method="POST"><button type="submit"></button></form><img src="presignedURL"></img></li>,
// set up image with src tags as the presigned urls,
// and key properties that hold the key for deletion purposes.
// dont forget about those delete buttons!.



// Elements
let photoList = document.querySelector('.photo-list');

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
    removeBtn.classList.add('hidden-print');
    removeBtn.innerText = 'X';
    removeBtn.setAttribute('type', 'submit');

    

    // Add listener to the new remove btn
    removeBtnForm.addEventListener("submit", async function(e) {
        e.preventDefault()
        await axios.post(`/photo/delete`, {
            key,
            photo_url
            })
          .then(function (response) {
            console.log(response);
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

// Create the list of songs for this playlist
async function appendPhotos() {
    photoList.innerHTML = "";
    try {
        const response = await axios.get(`/photo/`);
        photos = response.data;
        console.log(photos);
        for(photo of photos) {
            photoEl = createPhotoDom(photo.key, photo.photo_url)
            photoList.append(photoEl);
        }
    } catch (error) {
        console.error(error);
    }
}
// initial call
appendPhotos()


import * as THREE from "three";
import { OrbitControls } from "orbitControls";
let canvas = document.querySelector("#bg")
console.log("working")

// instantiate scene
const scene = new THREE.Scene();
// instantiate camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// set camera position
camera.position.setZ(1);
// NOTE: for this project we dont need a light (yet)

// instantiate renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg")
})
// set pixel ratio and size for renderer
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// instantiate orbit controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableZoom = false;


// logic for photos
let fetchedPhotos;
let currentPhoto;
const previousPhotoButton = document.querySelector(".previous-photo-button");
const nexPhotoButton = document.querySelector(".next-photo-button");

// --TODO: This will everntually take a param for the photo URL
const renderPhoto = (photoURL="room1") => {
  // photo mesh setup
  const geometry = new THREE.SphereGeometry( 500, 60, 40 );
  geometry.scale( - 1, 1, 1 );
  let material = new THREE.MeshBasicMaterial( {
    map: new THREE.TextureLoader().load(`${photoURL}`, () => {
      const mesh = new THREE.Mesh( geometry, material );
      // remove previous mesh and add new
      scene.remove( mesh );
      scene.add( mesh );
      canvas.classList.remove("hidden");
      canvas.classList.add("visible");
    }),
  });
}

const getPhotos = async () => {
  //1. get the name of the album from query param
  // 2. get all photos urls related to that album from the DB
    // --TODO this is just test data. We need to get and store the data later.
    const photos = await axios.get(`/photo/demo`);
    console.log(photos)
  // 3. if photos, return them
  if(photos) {
    fetchedPhotos = photos.data;
    console.log(fetchedPhotos)
    currentPhoto = fetchedPhotos[0];
    setTimeout(function(){
      renderPhoto(fetchedPhotos[0]);
    }, 1000);//wait 2 seconds
  }  
}

// initial call
getPhotos();

const changePhoto = (direction) => {

  //--TODO set up function so that it makes a get request to our server,
  // and fetches the next room base on whether we are moving forwards or backwars.
  // We may end up fetching and storing an array of rooms in a different function for loading purposes.
  // The goal right now is just to get something working.
  // check which button was pressed
  if(direction === "previous") {
    // get the prev photo
    let prevPhoto = fetchedPhotos[fetchedPhotos.indexOf(currentPhoto) - 1];
    // go to previous photo
    
    if(prevPhoto) {
      canvas.classList.remove("visible");
      canvas.classList.add("hidden");
      // hack for fade timing
      setTimeout(function(){
        currentPhoto = prevPhoto;
        renderPhoto(prevPhoto);
      }, 1000);//wait 1 seconds
    }
    } else if (direction === "next") {
      // get to next photo
      let nextPhoto = fetchedPhotos[fetchedPhotos.indexOf(currentPhoto) + 1]
      if(nextPhoto) {
        canvas.classList.remove("visible");
        canvas.classList.add("hidden");
        setTimeout(function(){
          currentPhoto = nextPhoto;
          renderPhoto(nextPhoto);
        }, 1000);//wait 1 seconds
      }
    }

  
  
}

// event listiners
previousPhotoButton.addEventListener('click', function (e) {
  changePhoto("previous")
});

nexPhotoButton.addEventListener('click', function (e) {
  changePhoto("next")
});

// animate
renderer.setAnimationLoop( function () {

	renderer.render( scene, camera );
  controls.update();

} );


// for dynamic resizing
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

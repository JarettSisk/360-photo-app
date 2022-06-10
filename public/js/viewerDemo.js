import * as THREE from "three";
import { OrbitControls } from "orbitControls";
let canvas = document.querySelector("#bg")

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

// Vars for photo logic
let fetchedPhotos;
let currentPhoto;
const previousPhotoButton = document.querySelector(".previous-photo-button");
const nextPhotoButton = document.querySelector(".next-photo-button");

// Function to render a photo into our scene. 
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

// Function to get photos from our mock db
const getPhotos = async () => {
  const photos = await axios.get(`/photo/demo`);

  if(photos) {
    fetchedPhotos = photos.data;
    currentPhoto = fetchedPhotos[0];
    setTimeout(function(){
      // Once photos are fetched, we render the first photo.
      renderPhoto(fetchedPhotos[0]);
    }, 1000);//wait 2 seconds
  }  
}



const changePhoto = (direction) => {
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
      }, 1000);//wait 1 second
    }
    } else if (direction === "next") {
      // get to next photo
      let nextPhoto = fetchedPhotos[fetchedPhotos.indexOf(currentPhoto) + 1]
      if(nextPhoto) {
        canvas.classList.remove("visible");
        canvas.classList.add("hidden");
        // hack for fade timing
        setTimeout(function(){
          currentPhoto = nextPhoto;
          renderPhoto(nextPhoto);
        }, 1000);//wait 1 second
      }
    }
}

// event listiners
previousPhotoButton.addEventListener('click', function (e) {
  // change to previous photo
  changePhoto("previous")
});

nextPhotoButton.addEventListener('click', function (e) {
  // change to next photo
  changePhoto("next")
});

// initial call
getPhotos();



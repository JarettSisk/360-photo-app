// three.js imports
import * as THREE from "three";
import { OrbitControls } from "orbitControls";
// html canvas
let canvas = document.querySelector("#bg")

// instantiate new three.js scene
const scene = new THREE.Scene();
// instantiate camera for viewing
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// set camera position
camera.position.setZ(1);
// NOTE: for this project we dont need a light (yet)

// instantiate webGL renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg")
})

// set pixel ratio and size for renderer
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// instantiate orbit controls - this allows us to 'move' or change camera direction within our scene.
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableZoom = false;

// animation loop - endless loop to update our view based on movement. 
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
let photos;
let currentPhoto;
const previousPhotoButton = document.querySelector(".previous-photo-button");
const nextPhotoButton = document.querySelector(".next-photo-button");

// Function to render a photo into our scene. 
const renderPhoto = (photoURL="room1") => {
  // Geometry for mesh
  const geometry = new THREE.SphereGeometry( 500, 60, 40 );
  geometry.scale( - 1, 1, 1 );
  // material for mesh
  let material = new THREE.MeshBasicMaterial({
    // Mapping the image texture to our material
    map: new THREE.TextureLoader().load(`${photoURL}`)
  });
  // set up the mesh
  const mesh = new THREE.Mesh( geometry, material );
  // remove current mesh and add new
  scene.remove( mesh );
  scene.add( mesh );
  canvas.classList.remove("hidden");
  canvas.classList.add("visible");
}

// Function to get photos from our mock db
const getPhotos = async () => {
  photos = await axios.get(`/photo/demo`);
  if(photos) {
    photos = photos.data;
    currentPhoto = photos[0];
    // hack for fade timing
    setTimeout(function(){
      // Render the first photo
      renderPhoto(photos[0]);
    }, 1000);//wait 2 seconds
  }  
}

const changePhoto = (direction) => {
  // check which button was pressed
  if(direction === "previous") {
    // get the prev photo
    let prevPhoto = photos[photos.indexOf(currentPhoto) - 1];
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
      let nextPhoto = photos[photos.indexOf(currentPhoto) + 1]
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



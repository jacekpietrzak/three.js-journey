console.log('hello 3js');
console.log(THREE);

// #1 - Scene
const scene = new THREE.Scene();

// #2 - Red Cube
// 2.1 create geometry
const geometry = new THREE.BoxGeometry(1, 1, 1);
// 2.2 create material
const material = new THREE.MeshBasicMaterial({ color: '#ff0000' });
// 2.3 combine all in one mesh
const mesh = new THREE.Mesh(geometry, material);
// 2.4 add to scene
scene.add(mesh);

// Sizes
const sizes = { width: 800, height: 600 };

// #3 - Camera - you can have multiple cameras and switch between those but we will have one because we can change the place of the camera instantaneously. We can have different types of camera but we will use Perspective camera.
// 3.1 - create camera - (FOV,Aspect Ratio) - standard FOV to use is between 45-55, aspect ratio - width / height - ratio based on the size of the width of rendered that we are going to create. Right now we will fix it to width=800 x height=600. Later we will tell to be exact window size.
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
// 3.2 - camera position
camera.position.z = 3;
// 3.3 - add to the scene
scene.add(camera);

// #4 Renderer - Render - Scene from camera poin of view, Result drawn into a canvas, Canvas is a HTML element that exist already in which you can draw stuff. So we nned to creat an html canvas tag.
// 4.1 - Select where to render - we are getting a canvas from html with class of webgl
const canvas = document.querySelector('.webgl');
// 4.2 - create renderer
const renderer = new THREE.WebGLRenderer({
  // privde canvas - where to render
  canvas: canvas,
});
// 4.3 - provide size of renderer
renderer.setSize(sizes.width, sizes.height);
// 4.4 - to render we need to give render method a scene and camera.
renderer.render(scene, camera);

// #5 - Move camera - right now we cant see anything because everything is in 0,0,0 we need to move the camera. Camera is inside the cube and by default you can see only one side of the triangle. It is not doublefaced. To move we can use position, rotation, scale props.
// position - x, y and z axis. Three.js considers the forward/backward axis to be z. X - is positive on right, Y - is positive on up, Z - is positive when towards us/camera

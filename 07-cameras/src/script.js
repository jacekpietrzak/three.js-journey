import * as THREE from 'three';

// we need to import OrbitControls from addons folder of three.
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Scene
const scene = new THREE.Scene();

// Object
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(mesh);

// Camera
/** Camera is an abstract Class youre not supposed to use it directly- This is the class that camera types like PerspectiveCamera or OrthographicCamera inherits from.
 * ArrayCamera - is to use multiple camera views on the splitscreen
 * StereoCamera - render the scene through two cameras that mimic the eyes to create a parallax effect. Use with devices like VR headset, red and blue glasses or cardboard.
 * CubeCamera - will make a render on each side of the cube - 6 renders in total - Can render the surrounding for things like environment map, reflection or shadow map.
 * OrthographicCamera - render without perspective.
 * PerspectiveCamera - 4 parameters PerspectiveCamera(wertical FOV(degrees), ratio, Near(clipping), Far(clipping) ) - near(clipping) shouldn go very low like 0.00001 we will have a glitch called z-fighting. Render wont know which object is in front. we can use 0.1, 100
 */

// PerspectiveCamera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  1,
  1000
);
// camera.position.x = 2;
// camera.position.y = 2;
camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

// // OrthographicCamera - instead of FOV we provide how far camera can see in each direction (lef, right, top, bottom) then near and far. We will have a problem becouse our renderer size aspect ratio is different than OrthographicCamera aspect ratio. We can fix it by multiplying left and right values of camera by aspect ratio of our renderer size.
// const aspecRatio = sizes.width / sizes.height;
// const ortoCamera = new THREE.OrthographicCamera(
//   -1 * aspecRatio,
//   1 * aspecRatio,
//   1,
//   -1,
//   0.1,
//   100
// );
// ortoCamera.position.x = 2;
// ortoCamera.position.y = 2;
// ortoCamera.position.z = 2;
// ortoCamera.lookAt(mesh.position);
// scene.add(ortoCamera);

/** Camera movement */
// First we need the mouse coordinates on the page. Listen to the mousemove event with addEventListener and retrieve the event.clientX and event.clientY. Those values are in pixels and its better to adjust them. We wabt a value with an amplitude of 1 and that can be both negative and positive. We will create a variable to store this values. We will create an object and it is good practice to always organize in objects.
/** cursor */
const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener('mousemove', (event) => {
  // we want to have values between 0-1 instead of pixels. We can have it thanks to dividing our pixels value by size of the viewport. We wan as well to have it negative and positive, to do that we need to subtract 0.5.
  cursor.x = event.clientX / sizes.width - 0.5;
  console.log('x:', cursor.x);
  cursor.y = event.clientY / sizes.height - 0.5;
  console.log('y:', cursor.y);
});
// Update camera position in the tick function with the cursor coordinates.

/** Controls
 * 1. Device orientation controls - will automatically retrieve the device orientation if your device, os, and browser allow it and rotate the camera accordingly. Useful to create immersive universes or VR experiences.
 * 2. FlyControls - enable moving the camera like if you were on a spaceship. You can rotate on all 3 axes, go forward and backward.
 * 3. FirstPersonControls - is like FlyControls, but with a fixed up asix (you cant do barrel roll), doesnt work like FPS games.
 * 4. PointerLockControls - uses the pointer lock JavaScript API. Hard to use and almost only handles the pointer lock and camera rotation.
 * 5. OrbitControls - similar to the controls we made with more features.
 * 6. TrackballControls - is like OrbitControls without the vertical angle limit.
 * 7. TransformControls - This class can be used to transform objects in 3D space by adapting a similar interaction model of DCC tools like Blender. Unlike other controls, it is not intended to transform the scene's camera.
 * 8. DragControls - This class can be used to provide a drag'n'drop interaction. Move object on the face parralel to camera. Has nothing to do with camera.
 */

/** OrbitControls - we will use it to control our camera. We need to provide camera and dom element that serve as a reference to put mouse events on it. We will use our camera and canvas. */
const controls = new OrbitControls(camera, canvas);
// we can change the target of controls
// controls.target.y = 1;
// // to apply it we need to cupdate controls.
// controls.update();
// we can add damping - making the camera movement more smoooth by adding Acceleration and friction. to enable damping, switch enable Damping prop to true.
controls.enableDamping = true; // right now it seems weird. Controls needs to update on each frame in order the dumping to work. We need to go to tick function and before renderer add controls.update()

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  /** Update Camera - one plane */
  // camera.position.x = cursor.x;
  // camera.position.y = -cursor.y;
  // camera looking at mesh
  // camera.lookAt(mesh.position);
  // camera looking at new vector - not great becouse we are creating new vector each frame.
  // camera.lookAt(new THREE.Vector3());

  /** Update Camera - Custom orbit - around */
  // if we combine sin on one axes and cos on another axes we will get a circle position. Axes that we wont to position our camera around the cube.
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  // we will use y for up and down
  // camera.position.y = cursor.y * 5;
  // camera looking at mesh
  // camera.lookAt(mesh.position);
  // we could add zoom in and zoom out but it will be easier to use build in controls to help us.

  /** Update Camera - OrbitControls
   * we need to comment our custom camera because our camera class will be handled by OrbitControls.
   * to add damping we need to update controls
   */
  controls.update();

  // Update objects
  //   mesh.rotation.y = elapsedTime;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

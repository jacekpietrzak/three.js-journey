import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// viewport is a content that we can see.

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth, // it says window but it is a viewport
  height: window.innerHeight,
};
// if we resize the window we can see white space or that the scene doesnt feet. We need to handle it. We will use an eventListener and update sizes.
window.addEventListener('resize', (e) => {
  console.log('width: ', window.innerWidth);
  console.log('height: ', window.innerHeight);
  // to have dynamic view update we need to:
  // 1. Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // 2. Update camera - we need as well to do that
  camera.aspect = sizes.width / sizes.height;

  // 3. still nothing. When changing properties like aspect, we need to call camera.updateProjectionMatrix()
  camera.updateProjectionMatrix();

  // 4. Objects are streatching and the problem is that our canvas does not take the whole space. We need to update our renderer.
  renderer.setSize(sizes.width, sizes.height);

  // if user change screen and resize canvas it will check aspec ratio.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/** Handle Fullscreen
 * We will add event listener that will check for double click anywhere in the screen to get into fullscreen
 * To go fullscreen, we need to use requestFullScreen() on concerned element (our <canvas>) you can take any element on the page and put it into fullscreen. To leave fullscreen we need to use document.exitFullscreen().
 */
window.addEventListener('dblclick', () => {
  // 1. we need to know if user is in fullscreen or not. Unfortunately this wont work on Safari. We need to use prefixed version document.webkitExitFullscreen().

  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement; // webkit is for safari
  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen;
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen;
    }
  }
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
/** Aspect Ratio
 * Some might see a blurry render and stairs effect on the edges. Its because you are testing on screen with pixel ratio greater than 1. Pixel ratio corresponds to how many physical pixels you have on the screen for one pixel unit on the software part. We need to handle this.
 * TO get the pixel ratio we can use window.devicePixelRatio. To update the renderer accordingly, we can use renderer.setPixelRatio(window.devicePixelRatio) below settin size of a renderer. We also need to limit the value of pixels to render because it is to expensive to render pixelratio 5 for instance. We will limit it to 2. To do that we will use Math.min which gives min value between 2 parameters. First will be device pixel ratio and second the one we want to be max.
 */
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // use it always. We should put it into resize event listener because sometime user can change the screen.

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

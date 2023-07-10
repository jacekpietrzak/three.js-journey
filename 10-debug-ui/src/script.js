import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import GUI from 'lil-gui';

/** Why do we need debug UI
 * We need to be able to tweak and debug easily
 * it concerns the developer, the designer and even the client
 * it will help finding the perfect color, speed, quentity, etc
 * thats why we need a debug UI
 *
 * We can use our own or use a library
 * dat.GUI
 * control-panel
 * controlKit
 * Guify
 * Oui
 *
 * We are going to use lil-gui - most popular
 */

/** How to implement GUI
 * 1. install by npm install lil-gui --save-dev
 * 2. adding elements by using gui.add(object,property you want to tweak) - gui.add(mesh.position, 'y) - if we want to add twek for something we need to add it after this variable is declared.
 */

/** How and when to use it?
 * To twek values
 * add tweks as you progress becuase if you want to add them at the end it will take hours
 */

/** Debug GUI */
const gui = new GUI();

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
mesh.position.y = 0.5;
// mesh.visible = false;
scene.add(mesh);

// Debug
gui.add(mesh.position, 'y', -1.5, 1.5, 0.01); // (object to control, 'parameter of this object to control', min, max, step) - default value is taken from the mesh
gui.add(mesh.position, 'x', -1.5, 1.5, 0.01);
// we can as well use methods to set min, max, step - it is not very clear and it takes a lot of space. We can as well add a labels with .name('name) method
gui.add(mesh.position, 'z').min(-1.5).max(1.5).step(0.01).name('z axis');
//  we will ad visibility property
gui.add(mesh, 'visible');
// we will add visible wireframe prop - we can also access material of a mesh by mesh.material
gui.add(material, 'wireframe');
// color we need to addColor
gui.addColor(material, 'color').name('material color');
// functions - we will do a short animation after button click but we need to have it in an object. We can have an object parameters and put this function inside it.
function spin() {
  console.log('spin');
  gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 }); // (what to animate, object{duration: number(sec), destination of the property(y: base value + how much to spin )})
}
const parameters = {
  spin: spin,
};
gui.add(parameters, 'spin');

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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

import * as THREE from 'three';
import gsap from 'gsap';

// FPS - Most screen run at 60 Frames per second but not always. Our animation must look the same regardless of the framerate. There is a solution for this problem. We are going to call funtion to ask what fps window has.
// window.requestAnimationFrame()
// The purpose of this function is to call the function provided on the next frame. We are going to call the same function once on each new frame. So we can use that function to do the animation.

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
// renderer.render(scene, camera);

/**
 * Animation
 */

/** Using GSAP Library */
// if you want to have more control, create tweens (transition from A to B), create timelines, etc. you can use GSAP library. to add it use
// gsap(what are we animating, {duration, delay, destination})
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });
// and we can put it back
gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 });

// GSAP has its own tick - it is doiwng request animation on its own. We dont need to tell it to update it self. But we still need to render the result in our tick.

// we need to build clock. It is a class so we need to instantiate it
const clock = new THREE.Clock();

const tick = () => {
  // we call it a tick because it is liek a timer on each frame. We can call it animation loop

  // Render - we can put here a render to render on each frame.
  renderer.render(scene, camera);
};
// we need to call this function at the end.
tick();

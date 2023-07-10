import * as THREE from 'three';
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

/** Using Clock */
// we call it a tick because it is liek a timer on each frame. We can call it animation loop

// we need to build clock. It is a class so we need to instantiate it
const clock = new THREE.Clock();

const tick = () => {
  // clock
  const elapsedTime = clock.getElapsedTime();
  // it get started in the time it gets initiated. It always starts at 0. It is in seconds
  console.log(elapsedTime);

  console.log('tick');
  // unfortunately higer framerate - higher rotation. Because of more call tick function per second. We can fix it using buit in class called Clock- it is in seconds and alway starts when clock is initiated.

  // Update objects - to use Clock we dont need to sum rotation we can just use Clock and multiply it.
  mesh.rotation.y = elapsedTime * Math.PI; // one full rotation per second.
  // mesh.position.y = Math.sin(elapsedTime); // we are using a sin for y movement.
  // mesh.position.x = Math.cos(elapsedTime); // we are using a cos for x movement. Because we use sin and cos we have our objects doing circles.

  // we can use it to move the camera.
  camera.position.y = Math.sin(elapsedTime);
  camera.position.x = Math.cos(elapsedTime); // the effect is similar but we can tell the camera to look at center
  camera.lookAt(mesh.position);

  // Render - we can put here a render to render on each frame.
  renderer.render(scene, camera);

  // now we are going to request it on each frame
  window.requestAnimationFrame(tick);
  // we will get as amy logs as our computer frame rate
};
// we need to call this function at the end.
tick();

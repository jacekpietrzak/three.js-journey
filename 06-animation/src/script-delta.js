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

/** Using Delta */
// we call it a tick because it is liek a timer on each frame. We can call it animation loop
// previouse time
let previousTime = Date.now();

const tick = () => {
  console.log('tick');
  // unfortunately higer framerate - higher rotation. Because of more call tick function per second. We can fix it by getting the time with native JS. We need to know how much time it's been since the last tick. Use Data.now() to get current timestamp. We will compere current time with a previous time whic is a Delta. We will use that Delta. We need to make a variable outside our tick funciton. let tim - let becaouse it will change.

  // we get Curent Time
  const currentTime = Date.now();
  //  we have previous time and current time and we will make a Delta of it.
  const deltaTime = currentTime - previousTime;
  // no we need tu update prvious time for the next tick
  previousTime = currentTime;

  //   console.log(deltaTime);
  // now we will use this delta time inside our animation by multipling animation by delta. Thanks to that the cube is rotating at the same speed regardles of the framerate.

  // Update objects
  //   mesh.position.x += 0.01;
  //   mesh.position.y += 0.01;
  //   mesh.rotation.reorder('XYZ');
  mesh.rotation.y += 0.001 * deltaTime;
  mesh.rotation.x += 0.001 * deltaTime;

  // Render - we can put here a render to render on each frame.
  renderer.render(scene, camera);

  // now we are going to request it on each frame
  window.requestAnimationFrame(tick);
  // we will get as amy logs as our computer frame rate
};
// we need to call this function at the end.
tick();

/** Using built-in Clock */

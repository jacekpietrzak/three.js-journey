import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/** What is geometry?
 * Composed of vertices (point coordinates in 3D spaces) and faces (triangles that join those vertices to create a surface.)
 * Can be used for meshes but also for particles - we get a prticle for each vertex, no faces.
 * Can store more data than the positions (UV coordinates, normals, colors, anything we want.)
 */

/** Three.js built in geometries
 * All geometries inherit from BufferGeometry class. This class has many built in methods like translate(), rotateX(), normalize(), etc
 * 1. BoxGeometry
 * 2. PlaneGeometry
 * 3. CircleGeometry
 * 4. ConeGeometry
 * All of them we can find on a threejs.org
 */

/** Box has 6 parameters
 * width - size on x axis
 * height - size on y axis
 * depth - size on z axis
 * widthSegments - How many subdivs in the x axis
 * heightSegments - How many subdivs in the y axis
 * depthSegments - How many subdivs in the z axis
 *
 * Subdivisions correspond to how many triangles should compose a face
 * 1 = w triangles per face
 * 2 = 8 triangles per face
 * example
 * const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
 */

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
// we cant see subdivs on box so we can add wireframe on material
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/** Buffer geometry - creating our own triangles
 * before creating we need to know how to store buffer geometry data. We are going to use Float32Array:(native js)
 * Typed Array - Can only store one type of value in our case floats
 * Fixed Length
 * Easier to handle for computer.
 *
 * Two ways of creating and filling Float32Array
 * Specify a length and then fill the array
 *
 * we can than convert that Float32Array to a BufferAttribute
 * const positionsAttribute = new THREE.BufferAttribute(positionsArray,3) - 3 corresponds to how many values compose one vertex (x,y,z) = 3
 */
const positionsArray = new Float32Array(9);
// first vertex
positionsArray[0] = 0; // x
positionsArray[1] = 0; // y
positionsArray[2] = 0; // z

// second vertex
positionsArray[3] = 0;
positionsArray[4] = 1;
positionsArray[5] = 0;

// third vertex
positionsArray[6] = 1;
positionsArray[7] = 0;
positionsArray[8] = 0;

/** second way */
// 1. create array with values for each vertex
const positionsArray2 = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]);
// 2. create BufferAttribute to store data
const positionsAttribute = new THREE.BufferAttribute(positionsArray2, 3);
// 3. create BufferGeometry
const customGeometry = new THREE.BufferGeometry();
// 4. We can add this BufferAttribute to our BufferGeometry with setAttribute(), position is the name that will be used in the shaders. Three js has build in shaders that are written with name = position. If we will use right now different name it wont work. We have to use name 'position'.
customGeometry.setAttribute('position', positionsAttribute);

const customMesh = new THREE.Mesh(customGeometry, material);
customMesh.position.x = 1;
scene.add(customMesh);

/** We will generate a bunch of random triangles */

const randomTriangle = new THREE.BufferGeometry();
const count = 10;
const positionsArray3 = new Float32Array(count * 3 * 3);
for (let i = 0; i < count * 3 * 3; i++) {
  positionsArray3[i] = (Math.random() - 0.5) * 4;
}
const positionsAttribute3 = new THREE.BufferAttribute(positionsArray3, 3);
randomTriangle.setAttribute('position', positionsAttribute3);
const randomTriangleMesh = new THREE.Mesh(randomTriangle, material);
scene.add(randomTriangleMesh);

/** Index
 * Some geometry have faces that share common vertices. Cube is a good example.
 * When creating a BufferGeometry we can specify a bunch of vertices and then the indices to create the faces and re-use vertices multiple times. We are not going to cover this here.
 */

// Sizes
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

// Camera
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

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
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

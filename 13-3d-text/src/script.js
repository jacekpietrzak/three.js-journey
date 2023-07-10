import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
// import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json';

THREE.ColorManagement.enabled = false;

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('/textures/matcaps/8.png');

/** Fonts
 * We are going to use TextBufferGeometry class but we need a prticular font family called typeface.
 * - how to get typeface?
 * - we can convert a font with tools like https://gero.github.io/facetype.js
 * - we can also use fonts provided by three.js
 * * - go to the /node_modules/three/examples/fonts/ folder
 * * - we can take the fonts and put them in the /static/ folder or import directly
 *
 * we will mix those two techniques
 * - Open /node_modules/three/examples/fonts/
 * - Take the helvetiker_regular.typeface.json and License files
 * - Put them in the /static/fonts/ folder
 * - use FontLoader
 */
// create geometry
// we are going to use TextBufferGeometry
const fontLoader = new FontLoader();
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
  console.log('loaded');
  const textGeometry = new TextGeometry('Hello Three.js', {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 6,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  //   textGeometry.computeBoundingBox();
  //   textGeometry.translate(
  //     -(textGeometry.boundingBox.max.x - 0.02) * 0.5, // 0.02 bevel
  //     -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
  //     -(textGeometry.boundingBox.max.z - 0.03) * 0.5
  //   );
  //   console.log(textGeometry.boundingBox);

  // there is simpler way of centering text .center()

  textGeometry.center();
  console.log(textGeometry.boundingBox);
  const textMaterial = new THREE.MeshMatcapMaterial();
  textMaterial.matcap = matcapTexture;
  textMaterial.flatShading = false;
  //   textMaterial.wireframe = true;
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);
  console.log(text);
});
// we will ad axis helper
/**
 * Center the text
 * we have few solutions
 * - Using the bounding - Information associated with the geometry that tells what space taken by the geometry. Can be box or sphere.
 * * - it helps three.js calculate if the object is on the screen (frustum culling) We are going to use the bounding measures to recenter the geometry
 * * - by default Three.js using sphere bounding. Calculate the box bounding with computeBoundingBox()
 * * - console.log(textGeometry.boundingBox) - now we have size of the text
 * - We will move it using translate and - textGeometry.boundingBox.max values - bevel *0.5 - half of it
 *
 * there is simpler way of centering text with method .center()
 */
const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

/**
 * Object
 */
// Lets create 100 donuts
// lets see hos much time needed to calculate this. using log.time() and after function we want to measure log.timeEnd()
// we are doing this wrong not optimized.
console.time('donuts');
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

for (let i = 0; i < 100; i++) {
  const donut = new THREE.Mesh(donutGeometry, donutMaterial);
  // lets add random positions for donuts
  donut.position.x = (Math.random() - 0.5) * 10;
  donut.position.y = (Math.random() - 0.5) * 10;
  donut.position.z = (Math.random() - 0.5) * 10;

  // lets add random rotation for donuts
  donut.rotation.x = Math.random() * Math.PI;
  donut.rotation.y = Math.random() * Math.PI;

  // let add random scale
  const scale = Math.random();
  donut.scale.set(scale, scale, scale);

  scene.add(donut);
}
console.timeEnd('donuts');

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
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

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

THREE.ColorManagement.enabled = false;

/** Textures
 * type of textures
 * 1. Color or albedo - color texture map
 * 2. Alpha - grayscale image, white - visible, black - not visible, between white and blac - some transparent
 * 3. Height/displacement - grayscale image, moving vertices to create convexity, need subsivisions
 * 4. Normal - add details, no need subsivisions, verticies wont move, lure the light about fave orientation, better performance than height map with subdivs
 * 5. Ambient occlusion - grayscale image, add fake shadows, not physically accurate, helps to create contrast and details
 * 6. Metalness - grayscale image, white is metallic, black is not metallic, mostly for reflection
 * 7. Roughness - grayscale image, in duo with metalness, white is rough, black is smooth, mostly for light dissipation
 *
 * Those textures follow the PBR principles
 * - Physically Based Rendering
 * - Many technics that tend to follow rel-life directions to get realistic results
 * - Becoming the standard for realistic renders
 * - Many software, engines, and libraries are using it
 */

/** loading textures
 * - we need texture url
 * - put textures in src/static/ folder
 * - use import name from 'path'
 *
 * Few ways of importing image
 */
// 1. Native JS
// const image = new Image();
// image.onload = () => {
//   const texture = new THREE.Texture(image);
//   // we need to use this texture in the material.Unfortunately texture variable has been declared in the function and we can not access it outside of this funciton.
//   console.log(texture);
// };
// image.src = '/textures/door/color.jpg';
// we cant use this image directly. We need to convert it to a three.js Texture class. We can create the texture outside the function and update it once the image is loaded with needsUpdate = true

// const image = new Image();
// const texture = new THREE.Texture(image);
// image.addEventListener('load', () => {
//   texture.needsUpdate = true;
// });
// image.src = 'textures/door/color.jpg';
// replace color property with map and use the texture const material = new THREE.MeshBasicMaterial({ map: texture });

/** 2. use textureLoader three.js class. One textureLoader can load multiple textures. We can send 3 functions after path. We can use them to see errors or if the image is loaded.
 * - load - when the image loaded successfully
 * - progress - when the loadins is in progress
 * - error - if something went wrong
 */

// const color = textureLoader.load(
//   './textures/door/color.jpg',
//   () => {
//     console.log('load');
//   },
//   () => {
//     console.log('progress'); // almost never work. We will see alternative
//   },
//   () => {
//     console.log('error'); // error becouse image cant be found
//   }
// );
/** loading manager - three.js class - usefull if we want to knot the global loading progress or be informed when everything is loaded. It has few callbacks that we can use
 * - loadingManager.onStart
 * - loadingManager.onLoad
 * - loadingManager.onProgress
 * - loadingManager.onError
 * */
const loadingManager = new THREE.LoadingManager(); // we will use it inside textureLoader
// loadingManager.onStart = () => {
//   console.log('loading started');
// };
// loadingManager.onLoad = () => {
//   console.log('loading finished');
// };
// loadingManager.onProgress = () => {
//   console.log('loading progressing');
// };
// loadingManager.onError = () => {
//   console.log('loading error');
// };
const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load('./textures/door/color.jpg');
const alphaTexture = textureLoader.load('./textures/door/alpha.jpg');
const ambientOcclusionTexture = textureLoader.load(
  './textures/door/ambientOcclusion.jpg'
);
const heightTexture = textureLoader.load('./textures/door/height.jpg');
const metalnessTexture = textureLoader.load('./textures/door/metalness.jpg');
const normalTexture = textureLoader.load('./textures/door/normal.jpg');
const roughness = textureLoader.load('./textures/door/roughness.jpg');

/** UV unwrapping
 * - how texture is placed on the geometry
 * - each vertex will have a 2D coordinate on flat plane
 * - we can see those uv coordinates in geometry.attributes.uv
 * - in there we have Float32BufferAttribute with item size of 2 which means one vertes has 2 coordinates like Vector2
 * - theese coordinates will help place the texture. There are generated by three.js
 * - if you create your own geometry you will need to specify the UV coordinates
 * - If you are making your model in 3d software you will need to do the UV unwrap
 */

/** Transforming texture
 * - Part of three.js class
 * - we can repeat texture by using repeat property. Its a Vector2 with x and yprops. We will use colorTexture again below it
 */
const colorTexture2 = textureLoader.load('./textures/door/color.jpg');
// by default, texture doesnt repeat and the last pixel is streatched repeating. We can change that with THREE.RepeatWrapping on the wrapS and wrapT props.
// colorTexture2.repeat.x = 2;
// colorTexture2.repeat.y = 3;
// colorTexture2.wrapS = THREE.RepeatWrapping;
// colorTexture2.wrapT = THREE.RepeatWrapping;
// // we can alternate the direction with THREE.MirroredRepeatWrapping
// colorTexture2.wrapS = THREE.MirroredRepeatWrapping;
// colorTexture2.wrapT = THREE.MirroredRepeatWrapping;

/** Offset
 * - Vector2
 */
// colorTexture2.offset.x = 0.5;
// colorTexture2.offset.y = 0.5;

/** Rotation
 * - rotation prop
 * - default rotation is from 0, 0 UV coordinates left bottom corner, we can move pivot point to center useng colorTexture.center.x=0.5 same for y
 */
// colorTexture2.center.x = 0.5;
// colorTexture2.center.y = 0.5;
// colorTexture2.rotation = Math.PI * 0.25;

/** Filtering and MipMapping
 * - if you look at the cub's top face whil this face is almost hidden , youll see a blurry texture. That is due to the filtering and mipmapping - which is good */
/** Mipmapping is a technique that concists of creating half smaller version of a texture again and again until we get a 1x1 texture. All those texture variations are sent to the GPU and the GPU will choose the most appropriate version of texture.
 * - all of this is handles by three.js and GPU but we can choose different algorithms. There are 2 types of filter algorithms.
 * - minification filter - happens when the pixels of texture are smaller than the pixels of the render. When the texture is to big for the surface it covers. For instance when we zoomout. We can change it by using minFilter
 * - THREE.NearestFilter - really sharp results but can get ugly with artefacts
 * - THREE.LinearFilter
 * - THREE.NearestMipmapNearestFilter
 * - THREE.LinearMipmapNearestFilter
 * - THREE.LinearMipmapLinearFilter (default)
 * - we can test them if we are not happy how the texture looks like.
 */
colorTexture2.minFilter = THREE.LinearFilter;

/** Magnification filter
 * - Happens when the texture is too small for the surface it covers - you get blurry version
 * - to avoid this blurriness we can change the filter using magFilter - 2 values
 * - THREE.NearestFilter - we will get sharp texture - better for performance - Minecraft like
 * - THREE.LinearFilter (default)
 * - if we are using THREE.NearestFilter on minFilter we dont need mipmaps. We can deactivate the mipmaps generation with colorTexture.generateMipmaps = false - hence smaller texture, we wont generate texture with different size versions.
 */

/** Texture format and optimisation
 * When preparing textures we need to remember about 3 things
 * - the weight - users will need to download textures choose the wright type
 * * - .jpg - lossy compression but lighter
 * * - .png - lossless compression but heavier
 * * - you can compress files with TinyPng website
 *
 * - size of the file (resolution) - each pixel will have to be stored on the GPU. GPU has storage limitations. Mipmapping increases the number of pixels to store. Try to reduce the size of images as much as possible.
 * * - mipmapping will produce a half smaller verion of the texture reapeatedly until 1x1. Because of that the texture wwidth and height must be a power of 2
 * * - always use resolutions like 512x512, 1024x1024, 512x2048
 *
 * - data
 * * - textures support transparency but we cant have it in jpg. If we want transapprency we need to have png with alpha.
 * * - if we want using normal map we want to have exact values which is why we shouldnt apply lossy compression and we better use .png
 */

/** Sometimes we can combine different data into one texture by using the red, green blue and alpha channels seperatly.
 * - one image with different channels and one image for various objects and apperances
 */

/** where to find textures
 * - poliigon.xom
 * - 3dtextures.me
 * - arroway-textures.ch
 * - substance designer
 */

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
// see uv coordinates
console.log(geometry.attributes.uv);
const material = new THREE.MeshBasicMaterial({ map: colorTexture2 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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
camera.position.z = 1;
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

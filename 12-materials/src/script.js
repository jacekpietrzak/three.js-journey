import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
THREE.ColorManagement.enabled = false

/** Materials are used to put a color on each visible pixel of the geometry
 * - algorithms are written in programs called shaders
 * - we dont need to use shaders. We can use built in materials.
 */

/**
 * LIL GUI - debug panel
 * To tweak our setting we will add Debug Panel
 */
const gui = new GUI()
// we have our panel running now we can add tweaks.
// the best way is to add it on the go for instance with the material or geometry or any other object that we want to tweak.

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const doorAlphaTexture = textureLoader.load(
  './textures/door/alpha.jpg',
)
const doorAmbientOcclusionTexture = textureLoader.load(
  './textures/door/ambientOcclusion.jpg',
)
const doorColorTexture = textureLoader.load(
  './textures/door/color.jpg',
)
const doorHeightTexture = textureLoader.load(
  './textures/door/height.jpg',
)
const doorMetalnessTexture = textureLoader.load(
  './textures/door/metalness.jpg',
)
const doorNormalTexture = textureLoader.load(
  './textures/door/normal.jpg',
)
const doorRoughnessTexture = textureLoader.load(
  './textures/door/roughness.jpg',
)
const gradientTexture = textureLoader.load(
  './textures/gradients/5.jpg',
)
const matCapTexture = textureLoader.load(
  './textures/matcaps/8.png',
)

/**
 * Materials -less materials - better performance
 * most of the properties can be set in 2 ways
 * 1. const material = new THREE.MeshBasicMaterial({
  map: doorColorTexture,
})
 * 2. const material = new THREE.MeshBasicMaterial() 
 * material.map = doorColorTexture
 */
/**
 * MeshBasicMaterial
 */
const basicMaterial = new THREE.MeshBasicMaterial({
  map: doorColorTexture,
})
// color - to set color after instatiating material we need to use:
// basicMaterial.color.set('blue')
//  or
// basicMaterial.color = new THREE.Color(0xff00ff)

// wireframe
// basicMaterial.wireframe = true

// opacity - to have opacity we need to set transparent to true
// basicMaterial.transparent = true
// basicMaterial.opacity = 0.5

// alpha map - control transparency with map
basicMaterial.transparent = true
basicMaterial.alphaMap = doorAlphaTexture

// side lets you decide which side of a face is visible
// THREE.FrontSide (default)
// THREE.BackSide
// THREE.DoubleSide - try to avoid it - additional calculations
basicMaterial.side = THREE.DoubleSide

/**
 * MeshNormalMaterial
 * - usually used to debug normals, but colors are so nice so you can use it.
 * - displays a nice purple color that looks like the normal texture
 * - Normals are information that contains the direction of the outside of the face
 * - if we are using THREE objects this information is already provided
 * - normals can be used for lighting, reflection, refraction, etc
 * - properties like wireframe, transparent, opacity and side works.
 * - it has flatshading prop - will flatten the faces, normals wont be interpolated between the vertices. No smoothness
 */
// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true

/**
 * MeshMatCapMaterial
 * - will display a color by using the normals as a reference to pick the right color on texture that looks like sphere
 * - set texture with matcap property
 * - we get an illusion that the objects are being illuminated
 *
 * where to find matcaps?
 * - github.com/nidorx/matcaps
 * - create with 3d software
 * - create with photoshop
 */
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matCapTexture

/**
 * MeshDepthMaterial
 * - will color geometry in white if close to near and black if close to far value of the camera.
 * - can be used for creating fogs
 * - for preprocessing
 */
// const material = new THREE.MeshDepthMaterial()

/**
 * MeshLambertMaterial
 * - first material that react to light
 * - have new properties related to lights but we will see those with other materials.
 * - its performant but we can see strange patterns on the geometry - shawod lines
 */
// const material = new THREE.MeshLambertMaterial()

/**
 * MeshPhongMaterial
 * - very similar result to Lambert material but the strange pattern is gone
 * - less performatn to Lambert material
 * - we can control light reflection with shiness and the color of this reflection with specular.
 */
// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color(0xff0000)

/**
 * MeshToonMaterial
 * - similar to LambertMaterial but with cartoonish style.
 * - sharp shadow but we can have a control over it by providing a gradient map.
 * - we see gradient instead of clear seperation because the gradient is small and the magFilter tires to fix it with the mipmapping
 * - we can set minFilter and magFilter to THREE.NearestFilter
 * - we can also deactivate the mipmapping with gradientTexture.generateMipmaps - false
 */
// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientTexture
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// // because we use NearestFilter we can deactivate mipmapping
// gradientTexture.generateMipmaps = false

/**
 * StandardMaterial
 * - use physically based rendering principles (PBR)
 * - like Lambert and Phond materials it supports lights but with more realistic algorithm and better parameters like roughness and metalness.
 * - we can change roughness and metalness
 * - aoMap - ambient occlusion map will add shadows where the texture is dark.
 * - displacementMap - will move the verticies to create relief
 * * - we need to increas segmentation of the mesh to make it nice
 * - Metalness and roughness - instead of using uniform values for the whole geometry we can use metalnessMap and roughnessMap
 * * - the effect looks weird because the metalness and roughness props still affect each map respectively. Comment metalness and roughness or use thei oryginal values. metalness(0) roughness(1)
 * - normalMap - will fake the normals orientation and add details on the surface regardless of the subdivision
 * * - we can change the normal intensity with the normalScale prop (Vector2)
 * - we can control Alpha with alphaMap. dont forget to use transparent=true
 */
// const material = new THREE.MeshStandardMaterial()
// material.metalness = 0
// material.roughness = 1
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.05
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set = (0.5, 0.5) // it is a Vector2 so 2 values
// material.transparent = true // for alpha texture
// material.alphaMap = doorAlphaTexture

// // GUI
// gui.add(material, 'metalness').min(0).max(1).step(0.0001) // metalness goes from 0 to 1
// gui.add(material, 'roughness').min(0).max(1).step(0.0001) // metalness goes from 0 to 1
// gui
//   .add(material, 'aoMapIntensity')
//   .min(0)
//   .max(10)
//   .step(0.0001) // metalness goes from 0 to 1
// gui
//   .add(material, 'displacementScale')
//   .min(0)
//   .max(2)
//   .step(0.0001)

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2
gui.add(material, 'metalness').min(0).max(1).step(0.0001) // metalness goes from 0 to 1
gui.add(material, 'roughness').min(0).max(1).step(0.0001) // metalness goes from 0 to 1
/**
 * MeshPhisicalMaterial
 * - same as MeshStandardMaterial but with support of a clear coat effect - effect for paints
 */

/**
 * PointsMaterial
 * - to create particles
 */

/**
 * Shader Material and RawShaderMaterial
 * - both can be used to create your own materials.
 * - we will learn about it later.
 */

/**
 * Environment Map
 * - image represents surrounding of the scen, used for reflection, refraction but also general lighting
 * - Supported by multiple materials but we will use MeshStandardMaterial
 * - three.js supports only cube environment maps
 * - to load cube texture we must use the CubeTextureLoader instead of the TextureLoader
 * - the array needs to be in the right order
 * - use the environmentMapTexture in the envMap property of the material.
 *
 * Where to find environment maps
 * - polyhaven.com
 * - to convert HDRIs to cube maps use https://matheowis.github.io/HDRI-to-CubeMap/
 */
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMapTexture = cubeTextureLoader.load([
  'textures/environmentMaps/0/px.jpg', // positive x - right
  'textures/environmentMaps/0/nx.jpg', // left
  'textures/environmentMaps/0/py.jpg', // top
  'textures/environmentMaps/0/ny.jpg', // bottom
  'textures/environmentMaps/0/pz.jpg', // back
  'textures/environmentMaps/0/nz.jpg', // front
])
material.envMap = environmentMapTexture

/**
 * Adding lights to see other materials
 * - AmbientLight(color, intensity)
 * - PointLight
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Objects
 */

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 64, 64),
  material,
)
sphere.position.x = -1.5

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1, 100, 100),
  material,
)

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material,
)
torus.position.x = 1.5

scene.add(sphere, plane, torus)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2),
  )
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // update objects
  //   sphere.rotation.y = 0.1 * elapsedTime
  //   plane.rotation.y = 0.1 * elapsedTime
  //   torus.rotation.y = 0.1 * elapsedTime

  //   sphere.rotation.x = 0.15 * elapsedTime
  //   plane.rotation.x = 0.15 * elapsedTime
  //   torus.rotation.x = 0.15 * elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()

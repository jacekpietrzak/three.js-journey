import * as THREE from 'three';

/**
 * Canvas
 */
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
// you can use it almost anywhere in the code but before renderer.render. Best is to do declaring position after creating mesh and befor adding it to the scene.

/** Position */
mesh.position.x = 0.7;
mesh.position.y = -0.6;
mesh.position.z = 1;
scene.add(mesh);
// thanks to vector3 we can set position at once (x,y,z) we can use it instead of position.x/y/z
mesh.position.set(1, -1, 1);

// object coorinates are declared with vector3 object. It is very usefull because it has a lot of helpful methods. Few below:
console.log(
  'Length between object and center of the sceen (0,0,0):',
  mesh.position.length()
); // length is a length between center of the sceen (0,0,0) and object position.
console.log('Created vector:'); // distance to some object for instance camera. We need to pass a parameter which is a vector3. We need to use it after camera initialization. Below will be distance to created vector in space.
mesh.position.distanceTo(new THREE.Vector3(0, 0, 1));

// Normalize - will take a vector and reduce it untill it is 1
mesh.position.normalize();
console.log('Length of a mesh after normalize:', mesh.position.length());

// Axes Helper - we will use it to see axes - default length of axes is 1 unit
const axesHelper = new THREE.AxesHelper(2);
// we can change the axes stroke length by puttin a number into the axesHelper(length)
// this is an object so we need to add it to the scene
scene.add(axesHelper);

/** Scale */
// is also a vector3
mesh.scale.x = 2;
mesh.scale.y = 0.5;
mesh.scale.z = 0.5;
// because it is vector3 we can change all at once:
mesh.scale.set(2, 0.5, 0.6);

/** Rotation */
// rotation hax also x, y and z. It is not a vector3 it is an Euler. Wuler is made to do rotation. When you change z,y, or z you can imagine putting a stick through the objects center in the axis direction and then rotating that object on that stick. To rotate we use PI number. We can use 3.14159 or method Math.PI = 180
// mesh.rotation.y = (2 * Math.PI) / 360; // 1 degree
// rotation is going in order x, y, z - It can couse problems but we can reorder the rotation using reorder and giving a string with our axis order. We need to use reorder before rotation.
mesh.rotation.reorder('YXZ');
mesh.rotation.x = Math.PI * 0.25;
mesh.rotation.y = Math.PI * 0.25;

/** Quaternion */
// Quaternion uses more mathematical way of rotation and rotation updates quaternion and vice versa. We can use both. Quaternion is hard to imagine.

/** Groups */
// we can put all objects that we arrenged in the scene in the group. Group inherits all Object properties so we can position, rotate, scale the whole group.
// create a group
const group = new THREE.Group();
group.position.y = 1;
scene.add(group);

// create a cube1
const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xffff00 })
);
// add cube1 to group
group.add(cube1);

// create a cube2
const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
// move cube2
cube2.position.set(-1.5, 0, 0);
// add cube2 to group
group.add(cube2);

// create a cube3
const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
);
// move cube3
cube3.position.set(1.5, 0, 0);
// add cube3 to group
group.add(cube3);
// now we can move, rotate and scale the whole group

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.x = 1;
camera.position.z = 3;
camera.position.y = 1;
scene.add(camera);
camera.position.set(0, 0, 3);

console.log('Distance to camera:', mesh.position.distanceTo(camera.position));

/** LookAt */
// Object3D has a lookAt() method which rotates the object so that its -z faces the target you provided. Target must be a Vector3. We can use a vector or a position of an object.
camera.lookAt(new THREE.Vector3(1, -0.5, 1));
// position is a Vector3 which is a position of a mesh
camera.lookAt(group.position);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

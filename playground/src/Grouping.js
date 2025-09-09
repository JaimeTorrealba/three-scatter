import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Pane } from "https://cdn.skypack.dev/tweakpane@3.1.7";
import { ThreeScatter } from 'three-scatter'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
const coneGeometry = new THREE.ConeGeometry(0.5, 1, 32);

// First tree
const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
const coneMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22 });
const coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);
coneMesh.scale.set(1.2, 1.2, 1.2);
coneMesh.position.y = 1;

// Second tree

const cylinderMaterial2 = new THREE.MeshStandardMaterial({ color: 0x8B42 });
const cylinderMesh2 = new THREE.Mesh(cylinderGeometry, cylinderMaterial2);
cylinderMesh2.position.x = -1.5;
cylinderMesh2.position.y = 0.5;
const coneMaterial2 = new THREE.MeshBasicMaterial({ color: 0x228Bff });
const coneMesh2 = new THREE.Mesh(coneGeometry, coneMaterial2);
coneMesh2.scale.set(1.2, 1.2, 1.2);
coneMesh2.position.x = -1.5;
coneMesh2.position.y = 1.5;

// Third tree

const cylinderMaterial3 = new THREE.MeshStandardMaterial({ color: 0x8B42 });
const cylinderMesh3 = new THREE.Mesh(cylinderGeometry, cylinderMaterial3);
cylinderMesh3.position.x = -0.5;
cylinderMesh3.position.z = 1;
cylinderMesh3.position.y = 0.5;
const coneMaterial3 = new THREE.MeshBasicMaterial({ color: 0x800080 });
const coneMesh3 = new THREE.Mesh(coneGeometry, coneMaterial3);
coneMesh3.scale.set(1.2, 1.2, 1.2);
coneMesh3.position.x = -0.5;
coneMesh3.position.y = 1.5;
coneMesh3.position.z = 1;

const treeGroup = new THREE.Group();
treeGroup.add(cylinderMesh, coneMesh, cylinderMesh2, coneMesh2, cylinderMesh3, coneMesh3);

/**
 * Light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};
/**
 * Resize
 */
window.addEventListener("resize", () => {
  // update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // update camera
  camera.aspect = sizes.width / sizes.height;

  camera.updateProjectionMatrix();
  // update renderer
  renderer.setSize(sizes.width, sizes.height);
});

/**
 * Debug
 * */

const pane = new Pane();

const options = {
  seed: 1,
  rotationY: 0,
  scale: 1,
  firstRockScale: 1,
};

pane.addInput(options, "seed", {
  min: -15,
  max: 15,
  step: 1
}).on('change', () => {
  scatter.setSeeds(options.seed);
  scatter.alignToSurfaceNormal();
});


pane.addInput(options, "scale", {
  min: 1,
  max: 5,
  step: 0.25
}).on('change', () => {
  scatter.setAll(model => {
    model.scale.set(options.scale, options.scale, options.scale);
  });
});

const removeBtn = pane.addButton({
  title: 'Remove collisions',
});
removeBtn.on('click', () => {
  scatter.removeCollisions();
});
const randomRotation = pane.addButton({
  title: 'Random rotation',
});
randomRotation.on('click', () => {
  scatter.setAll(model => {
    model.rotation.y = Math.random() * Math.PI * 2;
  });
  // scatter.alignToSurfaceNormal();
});


/**
 * Scatter
 */
const floorLoader = new GLTFLoader();
let scatter
let floorModel
floorLoader.load("/surfaceSamplingTest.glb", (_floor) => {
  floorModel = _floor.scene.children[0];
  const floor = _floor.scene.children[0].geometry;
  _floor.scene.scale.set(0.5, 0.5, 0.5);
  scatter = new ThreeScatter(15, floor, treeGroup);
  scatter.scale.set(0.5, 0.5, 0.5);
  scene.add(scatter, _floor.scene);
});


/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 30
camera.position.y = 10
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setClearColor("#111");
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Controls
 */
const control = new OrbitControls(camera, renderer.domElement);
control.enablePan = true;
control.enableRotate = true;

// Animate
function animate() {
  control.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Pane } from "https://cdn.skypack.dev/tweakpane@3.1.7";
import { ThreeScatter } from 'three-scatter'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);

/**
 * Custom Objects
 */
const torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
const torusMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);

const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

const capsuleGeometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
const capsuleMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const capsuleMesh = new THREE.Mesh(capsuleGeometry, capsuleMaterial);

const cilinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
const cilinderMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff });
const cilinderMesh = new THREE.Mesh(cilinderGeometry, cilinderMaterial);

const coneGeometry = new THREE.ConeGeometry(0.5, 1, 32);
const coneMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
const coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);

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
});

pane.addInput(options, "rotationY", {
  min: -Math.PI,
  max: Math.PI
}).on('change', () => {
  scatter.setAll(model => {
    model.rotation.y = options.rotationY;
  });
});
pane.addInput(options, "scale", {
  min: 1,
  max: 5,
  step: 1
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
const wireframeBtn = pane.addButton({
  title: 'Wireframe',
});
wireframeBtn.on('click', () => {
  floorModel.material.wireframe = !floorModel.material.wireframe;
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

  scatter = new ThreeScatter(6, floor);
  scatter.add(
    torusMesh,
    boxMesh,
    sphereMesh,
    capsuleMesh,
    cilinderMesh,
    coneMesh
  )

  scatter.setSeeds(5);
  scatter.position.y = 1;
  scatter.setAll(model => {
    model.scale.set(3,3,3);
  });


  scene.add(_floor.scene, scatter);
});


/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 45
camera.position.y = 15
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

/**
 * Fullscreen
 */
window.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    renderer.domElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});
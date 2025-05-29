import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Pane } from "https://cdn.skypack.dev/tweakpane@3.1.7";
// import Stats from 'stats-js';
import { ThreeScatter } from 'three-scatter'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.PlaneGeometry(50, 50, 100, 100);
// const geometry = new THREE.BoxGeometry(10,10,10, 20,20,20);
const material = new THREE.MeshStandardMaterial({ color: 0xe4e4e4 })
const sphere = new THREE.Mesh(geometry, material)
scene.add(sphere)

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
});
const alignBtn = pane.addButton({
  title: 'Aligns',
});
alignBtn.on('click', () => {
  scatter.alignToSurfaceNormal();
});
const setDebugBtn = pane.addButton({
  title: 'Set Debug',
});
setDebugBtn.on('click', () => {
  scatter.setDebug();
});
const rmvSDebugBtn = pane.addButton({
  title: 'Remove Debug',
});
rmvSDebugBtn.on('click', () => {
  scatter.removeDebug();
});

/**
 * Random Number Generator
 * */

function createLCGRandom(seed = Date.now()) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;

  return function () {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

const random = createLCGRandom();

/**
 * Scatter
 */
const toScatterLoader = new GLTFLoader();
const url = "/rocks.glb";
let scatter
toScatterLoader.load(url, (_model) => {
  const model = _model.scene;
  scatter = new ThreeScatter(geometry, model, 1000, {
    randomFn: random,
    debug: true
  });
  scene.add(scatter);

});


/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 45
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


/**
 * Stats
 */
// const stats = new Stats();
// stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild(stats.dom);

// Animate
function animate() {

  control.update();
  // stats.begin();
  renderer.render(scene, camera);
  // stats.end();
  requestAnimationFrame(animate);
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
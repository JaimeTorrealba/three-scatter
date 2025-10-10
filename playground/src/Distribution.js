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
  xAxis: 0,
  yAxis: 0,
  zAxis: 0,
};

pane.addInput(options, "xAxis", {
  label: "X Axis",
  min: -1,
  max: 0.75,
  step: 0.01
}).on('change', () => {
  scatter.setAxis(
    [options.xAxis, options.xAxis + 0.5],
    [-2, -2.2],
    [-2, -2.2]);
});

pane.addInput(options, "yAxis", {
  label: "Y Axis",
  min: -1,
  max: 0.75,
  step: 0.01
}).on('change', () => {
  scatter.setAxis(
    [-2, -2.2],
    [options.yAxis, options.yAxis + 0.5],
    [-2, -2.2]);
});

pane.addInput(options, "zAxis", {
  label: "Z Axis",
  min: -1,
  max: 0.75,
  step: 0.01
}).on('change', () => {
  scatter.setAxis(
    [-2, -2.2],
    [-2, -2.2],
    [options.zAxis, options.zAxis + 0.5]);
});


const geometry = new THREE.SphereGeometry(5, 32);
const material = new THREE.MeshStandardMaterial({ color: 0xe4e4e4 })
const sphere = new THREE.Mesh(geometry, material)
scene.add(sphere)
/**
 * Scatter
 */
const toScatterLoader = new GLTFLoader();
const url = "/rocks.glb";
let scatter
toScatterLoader.load(url, (_model) => {
  const model = _model.scene;
  scatter = new ThreeScatter(50, geometry, model, {
    // debug: true
  });
  scatter.alignToSurfaceNormal();
  scatter.setAll(model => {
    model.scale.set(1.5, 1.5, 1.5);
  });
  scene.add(scatter);

});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 15
camera.position.y = 5
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
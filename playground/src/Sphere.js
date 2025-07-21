import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Pane } from "https://cdn.skypack.dev/tweakpane@3.1.7";
import { ThreeScatter } from 'three-scatter'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.SphereGeometry(5, 32);
// const geometry = new THREE.BoxGeometry(10,10,10, 20,20,20);
const material = new THREE.MeshStandardMaterial({ color: 0xe4e4e4 })
const sphere = new THREE.Mesh(geometry, material)
scene.add(sphere)

// Enable VertexNormalsHelper for debugging
const helper = new VertexNormalsHelper(sphere, 0.5, 0xff0000);

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

const helperBtn = pane.addButton({
  title: 'Helper',
});
helperBtn.on('click', () => {
  if (helper.parent) {
    helper.parent.remove(helper);
  } else {
    scene.add(helper);
  }
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
const wireframeBtn = pane.addButton({
  title: 'Wireframe',
});
wireframeBtn.on('click', () => {
  sphere.material.wireframe = !sphere.material.wireframe;
});

/**
 * Scatter
 */
const toScatterLoader = new GLTFLoader();
const url = "/rocks.glb";
let scatter
toScatterLoader.load(url, (_model) => {
  const model = _model.scene;
  scatter = new ThreeScatter(75, geometry, model, {
    debug: true
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
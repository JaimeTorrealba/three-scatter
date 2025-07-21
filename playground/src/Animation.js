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
const geometry = new THREE.PlaneGeometry(15, 15, 100, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xe4e4e4 })
const sphere = new THREE.Mesh(geometry, material)
sphere.rotation.x = -Math.PI / 2; // Rotate to make it horizontal
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
  scale: 0.1,
};

pane.addInput(options, "seed", {
  min: -15,
  max: 15,
  step: 1
}).on('change', () => {
  scatter.setSeeds(options.seed);
});

pane.addInput(options, "scale", {
  min: 0.01,
  max: 1,
}).on('change', () => {
  scatter.setAll(model => {
    model.scale.set(options.scale, options.scale, options.scale);
  });
});

const logPositions = pane.addButton({
  title: 'Log positions',
});
logPositions.on('click', () => {
  const currentPost = scatter.getPositions();
  console.log('getPositions', currentPost);
});
const logFaces = pane.addButton({
  title: 'Log faces',
});
logFaces.on('click', () => {
  const allFaces = scatter.getFaces();
  console.log('getFaces', allFaces);
});

/**
 * Scatter
 */
const toScatterLoader = new GLTFLoader();
const url = "/Mushnub.glb";
let scatter;
let mixer = [];
toScatterLoader.load(url, (_model) => {
  scatter = new ThreeScatter(10, geometry, _model.scene, {
    useSkeletonUtils: true
  });
  scatter.setAll((model, i) => {
    mixer.push(new THREE.AnimationMixer(model));
    mixer[i].clipAction(_model.animations[0]).play();
    model.rotation.x = Math.PI / 2;
    model.scale.set(0.5, 0.5, 0.5);
  });
  scatter.rotation.x = -Math.PI / 2;

  scene.add(scatter);
});


/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 15
camera.position.y = 10
camera.lookAt(0, 0, 0)
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
  requestAnimationFrame(animate);
  // stats.begin();
  if (mixer) {
    mixer.forEach((_mixer, i) => {
      _mixer.update(0.001 + i * 0.001); // Update each mixer with a slight delay
    });
  }
  renderer.render(scene, camera);
  // stats.end();
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
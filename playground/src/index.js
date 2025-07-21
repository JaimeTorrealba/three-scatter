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
pane.addInput(options, "firstRockScale", {
  min: 1,
  max: 15,
  step: 1
}).on('change', () => {
  scatter.children[0].scale.set(options.firstRockScale, options.firstRockScale, options.firstRockScale);
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
const toScatterLoader = new GLTFLoader();
const floorLoader = new GLTFLoader();
const url = "/rocks.glb";
let scatter
let floorModel
toScatterLoader.load(url, (_model) => {
  floorLoader.load("/surfaceSamplingTest.glb", (_floor) => {
    floorModel = _floor.scene.children[0];
    const floor = _floor.scene.children[0].geometry;
    _floor.scene.scale.set(0.5, 0.5, 0.5);

    const model = _model.scene;
    scatter = new ThreeScatter(100, floor, model, {
      // seeds: 1,
      // precision: 0.1,
      //debug: true
    });
    scatter.scale.set(0.5, 0.5, 0.5);
    scene.add(scatter, _floor.scene);
  });
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
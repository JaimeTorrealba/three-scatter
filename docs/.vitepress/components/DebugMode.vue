<script setup>
import { Scene, PlaneGeometry, MeshBasicMaterial, Mesh } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import { createCamera } from "../utils/camera";
import { createRenderer } from "../utils/renderer";
import { createLights } from "../utils/lights";
import { createOrbitControls } from "../utils/orbitControls";
import { createEnvironmentTexture } from "../utils/environmentTexture";
import { ThreeScatter } from "three-scatter";
import { nextTick, onMounted } from "vue";
import { Pane } from "tweakpane";

onMounted(async () => {
  await nextTick();

  const renderer = createRenderer();
  const scene = new Scene();
  const camera = createCamera(scene);
  camera.position.set(0, 0, 30);
  createLights(scene);
  createEnvironmentTexture(scene, renderer);
  const control = createOrbitControls(camera, renderer.domElement);

  const surfaceGeo = new PlaneGeometry(50, 50, 32, 32);
  scene.add(new Mesh(surfaceGeo, new MeshBasicMaterial({ color: 0x808080 })));

  let scatter;
  let debugOn = true;

  const loader = new GLTFLoader();
  loader.load('/models/trunk-long.glb', (_model) => {
    const model = _model.scene;
    scatter = new ThreeScatter(1500, surfaceGeo, model, { debug: true });
    scatter.alignToSurfaceNormal();
    scene.add(scatter);
  });

  const container = document.getElementById('webGl').parentElement;
  const options = { seed: 0 }
  const pane = new Pane({ container });

  pane.addButton({ title: 'Toggle Debug' }).on('click', () => {
    if (!scatter) return;
    debugOn = !debugOn;
    debugOn ? scatter.setDebug() : scatter.removeDebug();
  });
  pane.addBinding(options, 'seed', { min: 0, max: 1000, step: 1 }).on('change', ({ value }) => {
    if (!scatter) return;
    scatter.setSeeds(value);
  });
  pane.addButton({ title: 'Full Screen' }).on('click', () => {
    if (!document.fullscreenElement) {
      container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });

  function animate() {
    control.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
});
</script>
<template>
  <div></div>
</template>
<style>
.tp-rotv{
  min-width: 150px;
  .tp-rotv_c{
    background-color: #808080;
    border-radius: 4px;
    padding: 0 0.1rem;

    .tp-lblv{
      padding: 0;
      border-radius: 4px;
      background-color: #333;
    }
  }
}
</style>
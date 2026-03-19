<script setup>
import { Scene } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import { createCamera } from "../utils/camera";
import { createRenderer } from "../utils/renderer";
import { createLights } from "../utils/lights";
import { createSphere } from "../utils/demoSphere";
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
  createLights(scene);
  createEnvironmentTexture(scene, renderer);
  const sphere = createSphere(scene);
  const control = createOrbitControls(camera, renderer.domElement);

  const toScatterLoader = new GLTFLoader();
  const url = "/models/trunk-long.glb";
  let scatter;
  toScatterLoader.load(url, (_model) => {
    const model = _model.scene;
    scatter = new ThreeScatter(75, sphere.geometry, model);
    scatter.alignToSurfaceNormal();
    scene.add(scatter);
  });


  const container = document.getElementById('webGl').parentElement;
  const pane = new Pane({ container });
  const alignBtn = pane.addButton({
    title: 'Aligns',
  });
  alignBtn.on('click', () => {
    scatter.alignToSurfaceNormal();
  });

  const resetBtn = pane.addButton({
    title: 'Reset',
  });
  resetBtn.on('click', () => {
    scatter.setAll((child) => child.rotation.set(0, 0, 0));
  });
  const fullScreenBtn = pane.addButton({
    title: 'Full Screen',
  });
  fullScreenBtn.on('click', () => {
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

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

  let scatter;
  new GLTFLoader().load('/models/trunk-long.glb', (_model) => {
    const model = _model.scene;
    scatter = new ThreeScatter(60, sphere.geometry, model);
    scatter.alignToSurfaceNormal();
    scene.add(scatter);
  });

  const container = document.getElementById('webGl').parentElement;
  const pane = new Pane({ container });
  const params = { individualScale: 1, groupScale: 1 };

  pane.addButton({ title: 'Apply Random Rotations' }).on('click', () => {
    if (!scatter) return;
    scatter.setAll((child) => {
      const r = Math.random() * Math.PI * 2;
      child.rotation.set(r, r * 0.7, r * 0.4);
    });
  });

  pane.addButton({ title: 'Reset' }).on('click', () => {
    if (!scatter) return;
    scatter.setAll((child) => child.rotation.set(0, 0, 0));
  });

  pane.addBinding(params, 'individualScale', { min: 0.1, max: 3, step: 0.05, label: 'Individual Scale' })
    .on('change', ({ value }) => {
      if (!scatter) return;
      scatter.setAll((child) => child.scale.set(value, value, value));
    });

  pane.addBinding(params, 'groupScale', { min: 0.1, max: 3, step: 0.05, label: 'Group Scale' })
    .on('change', ({ value }) => {
      if (!scatter) return;
      scatter.scale.set(value, value, value);
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

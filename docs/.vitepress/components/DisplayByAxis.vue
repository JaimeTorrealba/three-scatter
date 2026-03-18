<script setup>
import { Scene } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
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
    scatter = new ThreeScatter(120, sphere.geometry, model);
    scatter.alignToSurfaceNormal();
    scene.add(scatter);
  });

  const container = document.getElementById('webGl').parentElement;
  const pane = new Pane({ container });
  const params = { yThreshold: -1 };

  pane.addBinding(params, 'yThreshold', { min: -1, max: 1, step: 0.01, label: 'Y Threshold' })
    .on('change', ({ value }) => {
      if (scatter) scatter.setAxis([-2, -2], [value, 1], [-2, -2]);
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

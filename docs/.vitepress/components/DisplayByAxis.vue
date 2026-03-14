<script setup>
import { Scene, Mesh, ConeGeometry, MeshStandardMaterial } from "three";
import { createCamera } from "../utils/camera";
import { createRenderer } from "../utils/renderer";
import { createLights } from "../utils/lights";
import { createSphere } from "../utils/demoSphere";
import { createOrbitControls } from "../utils/orbitControls";
import { ThreeScatter } from "three-scatter";
import { nextTick, onMounted } from "vue";

onMounted(async () => {
  await nextTick();
  const { Pane } = await import('https://esm.sh/tweakpane@4');

  const renderer = createRenderer();
  const scene = new Scene();
  const camera = createCamera(scene);
  createLights(scene);
  const sphere = createSphere(scene);
  const control = createOrbitControls(camera, renderer.domElement);

  const model = new Mesh(
    new ConeGeometry(0.18, 0.65, 7),
    new MeshStandardMaterial({ color: 0xc47a3a })
  );

  const scatter = new ThreeScatter(120, sphere.geometry, model);
  scatter.alignToSurfaceNormal();
  scene.add(scatter);

  const container = document.getElementById('webGl').parentElement;
  const pane = new Pane({ container });
  const params = { yThreshold: -1 };

  pane.addBinding(params, 'yThreshold', { min: -1, max: 1, step: 0.01, label: 'Y Threshold' })
    .on('change', ({ value }) => {
      scatter.setAxis([-2, -2], [value, 1], [-2, -2]);
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

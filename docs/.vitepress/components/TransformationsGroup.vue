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
    new ConeGeometry(0.2, 0.7, 7),
    new MeshStandardMaterial({ color: 0xc47a3a })
  );

  const scatter = new ThreeScatter(60, sphere.geometry, model);
  scene.add(scatter);

  const container = document.getElementById('webGl').parentElement;
  const pane = new Pane({ container });
  const params = { scale: 1.0, rotationY: 0.0 };

  pane.addBinding(params, 'scale', { min: 0.1, max: 2, step: 0.01, label: 'Scale' })
    .on('change', ({ value }) => scatter.scale.set(value, value, value));

  pane.addBinding(params, 'rotationY', { min: 0, max: Math.PI * 2, step: 0.01, label: 'Rotation Y' })
    .on('change', ({ value }) => { scatter.rotation.y = value; });

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

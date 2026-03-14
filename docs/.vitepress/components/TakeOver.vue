<script setup>
import { Scene, Mesh, BoxGeometry, MeshStandardMaterial } from "three";
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

  const geo = new BoxGeometry(0.25, 0.5, 0.25);
  const mat = new MeshStandardMaterial({ color: 0xc47a3a });
  let meshes = [];

  function place(seed) {
    meshes.forEach(m => scene.remove(m));
    meshes = [];
    const scatter = new ThreeScatter(50, sphere.geometry);
    scatter.setSeeds(seed);
    scatter.getPositions().forEach(pos => {
      const mesh = new Mesh(geo, mat);
      mesh.position.copy(pos);
      scene.add(mesh);
      meshes.push(mesh);
    });
  }

  place(1);

  const container = document.getElementById('webGl').parentElement;
  const pane = new Pane({ container });
  const params = { seed: 1 };

  pane.addBinding(params, 'seed', { min: 1, max: 30, step: 1, label: 'Seed' })
    .on('change', ({ value }) => place(value));

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

<script setup>
import { Scene, Mesh, ConeGeometry, SphereGeometry, MeshStandardMaterial } from "three";
import { createCamera } from "../utils/camera";
import { createRenderer } from "../utils/renderer";
import { createLights } from "../utils/lights";
import { createSphere } from "../utils/demoSphere";
import { createOrbitControls } from "../utils/orbitControls";
import { ThreeScatter } from "three-scatter";
import { nextTick, onMounted } from "vue";

onMounted(async () => {
  await nextTick();

  const renderer = createRenderer();
  const scene = new Scene();
  const camera = createCamera(scene);
  createLights(scene);
  const sphere = createSphere(scene);
  const control = createOrbitControls(camera, renderer.domElement);

  const model1 = new Mesh(
    new ConeGeometry(0.22, 0.8, 7),
    new MeshStandardMaterial({ color: 0xc47a3a })
  );
  const model2 = new Mesh(
    new SphereGeometry(0.22, 8, 6),
    new MeshStandardMaterial({ color: 0x4a8fd4 })
  );

  const scatter = new ThreeScatter(100, sphere.geometry, [model1, model2], {
    distribution: [0.25, 0.75],
  });
  scene.add(scatter);

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

<script setup>
import { Scene, Mesh, Group, CylinderGeometry, BoxGeometry, MeshStandardMaterial, Clock } from "three";
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

  const model = new Group();
  model.add(new Mesh(
    new CylinderGeometry(0.1, 0.15, 0.35, 8),
    new MeshStandardMaterial({ color: 0x8b6914 })
  ));
  const arm = new Mesh(
    new BoxGeometry(0.5, 0.08, 0.08),
    new MeshStandardMaterial({ color: 0xc47a3a })
  );
  arm.position.y = 0.28;
  model.add(arm);

  const scatter = new ThreeScatter(35, sphere.geometry, model, { useSkeletonUtils: false });
  scene.add(scatter);

  const arms = scatter.children.map(child => child.children[1]);
  const clock = new Clock();
  let paused = false;

  const container = document.getElementById('webGl').parentElement;
  const pane = new Pane({ container });
  const btn = pane.addButton({ title: 'Pause' });
  btn.on('click', () => {
    paused = !paused;
    btn.title = paused ? 'Play' : 'Pause';
    if (!paused) clock.start();
  });

  function animate() {
    control.update();
    if (!paused) {
      const t = clock.getElapsedTime();
      arms.forEach((a, i) => {
        if (a) a.rotation.y = t * 2 + i * 0.55;
      });
    }
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
});
</script>
<template>
  <div></div>
</template>

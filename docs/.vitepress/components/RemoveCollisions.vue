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

  const baseModel = new Mesh(
    new ConeGeometry(0.65, 1.6, 7),
    new MeshStandardMaterial({ color: 0xc47a3a })
  );

  let scatter = create();

  const container = document.getElementById('webGl').parentElement;
  const pane = new Pane({ container });
  const params = { count: `${scatter.children.length} objects` };
  const countDisplay = pane.addBinding(params, 'count', { readonly: true, label: 'Objects' });

  function create() {
    const s = new ThreeScatter(70, sphere.geometry, baseModel);
    scene.add(s);
    return s;
  }

  pane.addButton({ title: 'Remove Collisions' }).on('click', () => {
    scatter.removeCollisions();
    params.count = `${scatter.children.length} objects`;
    countDisplay.refresh();
  });

  pane.addButton({ title: 'Reset' }).on('click', () => {
    scatter.cleanGroup();
    scene.remove(scatter);
    scatter = create();
    params.count = `${scatter.children.length} objects`;
    countDisplay.refresh();
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

<script setup>
import { Scene, PlaneGeometry, MeshStandardMaterial, Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { createCamera } from "../utils/camera";
import { createRenderer } from "../utils/renderer";
import { createLights } from "../utils/lights";
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
  const control = createOrbitControls(camera, renderer.domElement);

  const surfaceGeo = new PlaneGeometry(50, 50, 32, 32);
  scene.add(new Mesh(surfaceGeo, new MeshStandardMaterial({ color: 0x3a6b4e })));

  let scatter;
  let debugOn = true;

  const loader = new GLTFLoader();
  loader.load('/models/trunk-long.glb', (_model) => {
    const model = _model.scene;
    scatter = new ThreeScatter(150, surfaceGeo, model, { debug: true });
    scatter.alignToSurfaceNormal();
    scene.add(scatter);
  });

  const container = document.getElementById('webGl').parentElement;
  const pane = new Pane({ container });

  pane.addButton({ title: 'Toggle Debug' }).on('click', () => {
    if (!scatter) return;
    debugOn = !debugOn;
    debugOn ? scatter.setDebug() : scatter.removeDebug();
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

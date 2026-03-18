<script setup>
import {
  Scene,
  Group,
  Mesh,
  MeshStandardMaterial,
  MeshBasicMaterial,
  CylinderGeometry,
  ConeGeometry,
} from "three";
import { createCamera } from "../utils/camera";
import { createRenderer } from "../utils/renderer";
import { createLights } from "../utils/lights";
import { createPlane } from "../utils/demoPlane";
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
  camera.position.set(0, 5, 10);
  createLights(scene);
  createEnvironmentTexture(scene, renderer);
  const plane = createPlane(scene);
  const control = createOrbitControls(camera, renderer.domElement);

  // Shared geometries
  const cylinderGeo = new CylinderGeometry(0.2, 0.2, 1, 8);
  const coneGeo = new ConeGeometry(0.5, 1, 8);

  // Helper to build a tree-like cluster mesh
  function makeTree(trunkColor, leafColor, offsetX = 0, offsetZ = 0) {
    const trunk = new Mesh(cylinderGeo, new MeshStandardMaterial({ color: trunkColor }));
    trunk.position.set(offsetX, 0.5, offsetZ);

    const leaves = new Mesh(coneGeo, new MeshBasicMaterial({ color: leafColor }));
    leaves.position.set(offsetX, 1.5, offsetZ);

    return [trunk, leaves];
  }

  // Build a group with 3 trees at different offsets — this is the "cluster"
  const clusterGroup = new Group();
  clusterGroup.add(...makeTree(0x8b4513, 0x228b22, 0, 0));
  clusterGroup.add(...makeTree(0x6b3410, 0x2e8b57, 0.9, 0.4));
  clusterGroup.add(...makeTree(0x7a3b15, 0x1a6b32, -0.5, 0.8));

  let scatter = new ThreeScatter(15, plane.geometry, clusterGroup);
  scatter.rotation.x = -Math.PI / 2;
  scatter.alignToSurfaceNormal();
  scene.add(scatter);

  const container = document.getElementById("webGl").parentElement;
  const pane = new Pane({ container });
  const params = { seed: 1, scale: 1 };

  pane
    .addBinding(params, "seed", { min: 1, max: 30, step: 1, label: "Seed" })
    .on("change", ({ value }) => {
      scatter.setSeeds(value);
      scatter.alignToSurfaceNormal();
    });

  pane
    .addBinding(params, "scale", { min: 0.1, max: 2, step: 0.05, label: "Scale" })
    .on("change", ({ value }) => {
      scatter.setAll(model => model.scale.set(value, value, value));
    });

  pane.addButton({ title: "Full Screen" }).on("click", () => {
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

<script setup>
import {
  Scene,
  InstancedMesh,
  CylinderGeometry,
  ConeGeometry,
  MeshStandardMaterial,
  Matrix4,
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

  const COUNT = 50;
  const matrix = new Matrix4();

  // Tree geometry: trunk + leaves as two InstancedMeshes sharing the same positions
  const trunkGeo = new CylinderGeometry(0.1, 0.1, 0.8, 6);
  const leavesGeo = new ConeGeometry(0.4, 0.9, 6);
  const trunkMat = new MeshStandardMaterial({ color: 0x8b4513 });
  const leavesMat = new MeshStandardMaterial({ color: 0x228b22 });

  const trunks = new InstancedMesh(trunkGeo, trunkMat, COUNT);
  const leaves = new InstancedMesh(leavesGeo, leavesMat, COUNT);
  scene.add(trunks, leaves);

  let scatter;

  function place(seed) {
    scatter = new ThreeScatter(COUNT, plane.geometry);
    scatter.setSeeds(seed);
    // PlaneGeometry vertices are in the XY plane (z=0). createPlane applies
    // rotation.x = -PI/2 to the mesh, mapping (x, y, 0) → (x, 0, -y) in world
    // space. Bake that transform directly into each matrix.
    scatter.getPositions().forEach((pos, i) => {
      matrix.makeTranslation(pos.x, 0.4, -pos.y);
      trunks.setMatrixAt(i, matrix);
      matrix.makeTranslation(pos.x, 1.25, -pos.y);
      leaves.setMatrixAt(i, matrix);
    });
    trunks.instanceMatrix.needsUpdate = true;
    leaves.instanceMatrix.needsUpdate = true;
  }

  place(1);

  const container = document.getElementById('webGl').parentElement;
  const pane = new Pane({ container });
  const params = { seed: 1 };

  pane.addBinding(params, 'seed', { min: 1, max: 30, step: 1, label: 'Seed' })
    .on('change', ({ value }) => place(value));
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

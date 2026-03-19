<script setup>
import { Scene } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
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

  new GLTFLoader().load("/models/trunk-long.glb", (trunk) => {
    new GLTFLoader().load("/models/rocks.glb", (rocks) => {
      const model1 = trunk.scene;
      const model2 = rocks.scene;
      const scatter = new ThreeScatter(50, plane.geometry, [model1, model2], {
        distribution: [0.25, 0.75],
      });
      scatter.rotation.x = -Math.PI / 2;
      scatter.alignToSurfaceNormal();
      scene.add(scatter);
    });
  });

  const container = document.getElementById("webGl").parentElement;
  const pane = new Pane({ container });
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

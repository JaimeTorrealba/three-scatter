<script setup>
import { Scene } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { createCamera } from "../utils/camera";
import { createRenderer } from "../utils/renderer";
import { createLights } from "../utils/lights";
import { createSphere } from "../utils/demoSphere";
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
  createLights(scene);
  createEnvironmentTexture(scene, renderer);
  const sphere = createSphere(scene);
  const control = createOrbitControls(camera, renderer.domElement);

  let scatter;
  new GLTFLoader().load("/models/trunk-long.glb", (_model) => {
    const model = _model.scene;
    scatter = new ThreeScatter(60, sphere.geometry, model, { seeds: 1 });
    scatter.alignToSurfaceNormal();
    scene.add(scatter);
  });

  const container = document.getElementById("webGl").parentElement;
  const pane = new Pane({ container });
  const params = { seed: 1 };

  pane
    .addBinding(params, "seed", { min: 1, max: 30, step: 1, label: "Seed" })
    .on("change", ({ value }) => {
      if (scatter) {
        scatter.setSeeds(value);
      }
      scatter.alignToSurfaceNormal();
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

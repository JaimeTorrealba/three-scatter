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

  let baseModel = null;
  let scatter = null;

  const container = document.getElementById("webGl").parentElement;
  const pane = new Pane({ container });
  const params = { count: "Loading..." };
  const countDisplay = pane.addBinding(params, "count", {
    readonly: true,
    label: "Objects",
  });

  function create() {
    const s = new ThreeScatter(300, plane.geometry, baseModel);
    s.rotation.x = -Math.PI / 2;
    s.alignToSurfaceNormal();
    scene.add(s);
    return s;
  }

  new GLTFLoader().load("/models/rocks.glb", (_model) => {
    baseModel = _model.scene;
    scatter = create();
    params.count = `${scatter.children.length} objects`;
    countDisplay.refresh();
  });

  pane.addButton({ title: "Remove Collisions" }).on("click", () => {
    if (!scatter) return;
    scatter.removeCollisions();
    params.count = `${scatter.children.length} objects`;
    countDisplay.refresh();
  });

  pane.addButton({ title: "Reset" }).on("click", () => {
    if (!scatter || !baseModel) return;
    scatter.cleanGroup();
    scene.remove(scatter);
    scatter = create();
    params.count = `${scatter.children.length} objects`;
    countDisplay.refresh();
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

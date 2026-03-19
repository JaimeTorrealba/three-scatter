<script setup>
import { Scene, Clock, AnimationMixer } from "three";
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

  const clock = new Clock();
  let paused = false;
  let mixers = [];

  new GLTFLoader().load('/models/Mushnub.glb', (_model) => {
    const scatter = new ThreeScatter(15, plane.geometry, _model.scene, { useSkeletonUtils: true });
    scatter.setAll((model, i) => {
      model.scale.set(0.5, 0.5, 0.5);
      const mixer = new AnimationMixer(model);
      mixer.clipAction(_model.animations[0]).play();
      mixers.push(mixer);
    });
    scatter.rotation.x = -Math.PI / 2;
    scatter.alignToSurfaceNormal();
    scene.add(scatter);
  });

  const container = document.getElementById('webGl').parentElement;
  const pane = new Pane({ container });
  const btn = pane.addButton({ title: 'Pause' });
  btn.on('click', () => {
    paused = !paused;
    btn.title = paused ? 'Play' : 'Pause';
  });
  pane.addButton({ title: 'Full Screen' }).on('click', () => {
    if (!document.fullscreenElement) {
      container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });

  function animate() {
    const delta = clock.getDelta();
    control.update();
    if (!paused) {
      mixers.forEach((mixer, i) => mixer.update((delta * 0.5) + i * 0.0001));
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

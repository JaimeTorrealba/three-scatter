<script setup>
import { Scene } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
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

  let baseModel = null;
  let scatter = null;

  const container = document.getElementById('webGl').parentElement;
  const pane = new Pane({ container });
  const params = { status: 'Loading...' };
  const statusDisplay = pane.addBinding(params, 'status', { readonly: true, label: 'Status' });

  function create() {
    const s = new ThreeScatter(150, sphere.geometry, baseModel);
    s.alignToSurfaceNormal();
    scene.add(s);
    return s;
  }

  new GLTFLoader().load('/models/trunk-long.glb', (_model) => {
    baseModel = _model.scene;
    scatter = create();
    params.status = `${scatter.children.length} objects`;
    statusDisplay.refresh();
  });

  pane.addButton({ title: 'Dispose' }).on('click', () => {
    if (!scatter) return;
    scatter.cleanGroup();
    scene.remove(scatter);
    scatter = null;
    params.status = '0 objects (disposed)';
    statusDisplay.refresh();
  });

  pane.addButton({ title: 'Recreate' }).on('click', () => {
    if (scatter || !baseModel) return;
    scatter = create();
    params.status = `${scatter.children.length} objects`;
    statusDisplay.refresh();
  });
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

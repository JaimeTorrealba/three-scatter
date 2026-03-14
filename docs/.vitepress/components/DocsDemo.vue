<script setup>
</script>

<template>
  <div class="docs-demo">
    <slot />
    <canvas id="webGl" />
  </div>
</template>

<style>
.docs-demo {
  position: relative;
  width: 100%;
  height: 420px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  margin: 1.5rem 0;
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .tp-dfwv {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 10;
  }
}
</style>

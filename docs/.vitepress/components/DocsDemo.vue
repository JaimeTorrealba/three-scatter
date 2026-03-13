<script setup>
defineProps({ src: { type: String, required: true } })
</script>

<template>
  <div class="docs-demo">
    <iframe :src="src" loading="lazy" />
  </div>
</template>

<style scoped>
.docs-demo {
  position: relative;
  width: 100%;
  height: 420px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  margin: 1.5rem 0;
}
iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}
</style>

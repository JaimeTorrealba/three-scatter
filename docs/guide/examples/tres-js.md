---
title: TresJS
description: Use ThreeScatter with TresJS
---

# TresJS

[Open demo on StackBlitz](https://stackblitz.com/edit/vitejs-vite-qpspyyen?file=src%2Fcomponents%2FTheExperience.vue)

`ThreeScatter` integrates naturally with [TresJS](https://tresjs.org). Use `extend` to register `ThreeScatter` as a Tres component, then reference it in the template like any other Three.js object.

```vue
<script setup>
import { shallowRef, watch } from 'vue'
import { extend } from '@tresjs/core'
import { useGLTF } from '@tresjs/cientos'
import { SphereGeometry } from 'three'
import { ThreeScatter } from 'three-scatter'

extend({ ThreeScatter })

const { state, isLoading } = useGLTF('/model.glb')
const geometry = new SphereGeometry(5, 32)

const scatterRef = shallowRef()

watch(scatterRef, (scatter) => {
  scatter.alignToSurfaceNormal()
})
</script>

<template>
  <TresMesh :geometry="geometry">
    <TresMeshBasicMaterial color="#ADA091" />
  </TresMesh>
  <TresThreeScatter
    v-if="!isLoading"
    ref="scatterRef"
    :args="[100, geometry, state.scene]"
  />
</template>
```

::: info
Use `shallowRef` for the scatter ref — `ThreeScatter` extends `THREE.Group` and deep reactivity would traverse the entire object tree unnecessarily.
:::

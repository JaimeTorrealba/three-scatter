---
title: Dispose
description: Properly dispose all geometries and materials from a ThreeScatter instance
---

# Dispose

<DocsDemo src="/demos/dispose.html" />

When you no longer need a scatter instance, call `cleanGroup` to dispose all geometries and materials and remove all meshes from the group.

```js
import { ThreeScatter } from 'three-scatter'

const scatter = new ThreeScatter(count, surface, model);
scene.add(scatter);

// Later, when done:
scatter.cleanGroup();
```

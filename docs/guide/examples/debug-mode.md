---
title: Debug Mode
description: Replace scattered objects with low-poly proxies to quickly find the right positions
---

# Debug Mode

DEMO

Debug mode replaces all scattered models with a low-poly mesh so you can quickly iterate on positions without the overhead of loading full assets.

You can enable it at construction time:

```js
import { ThreeScatter } from 'three-scatter'
import * as THREE from 'three'

const scatter = new ThreeScatter(count, surface, model, {
  debug: true,
  debugGeometry: new THREE.SphereGeometry(0.5, 3, 2),
  debugMaterial: new THREE.MeshBasicMaterial({ color: 0x800080 }),
});
```

Or toggle it at any point after instantiation:

```js
scatter.setDebug();    // enable debug mode
scatter.removeDebug(); // disable debug mode
```

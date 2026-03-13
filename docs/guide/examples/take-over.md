---
title: Take Over Mode
description: Use ThreeScatter in take over mode to control your own objects and only get the scattered positions
---

# Take Over Mode

<DocsDemo src="/demos/take-over.html" />

If you don't need `ThreeScatter` to handle your models, you can instantiate the class without any models and retrieve the positions yourself.

```js
import { ThreeScatter } from 'three-scatter'

const scatter = new ThreeScatter(count, surface);
const positions = scatter.getPositions();
```

You can still get different positions using the `setSeeds` method, but you will need to update your models manually.

> **Note:** Using this approach means no internal method will have effects on your models.

## Take over with custom objects

You can also pass your own custom objects and let `ThreeScatter` only handle positioning:

```js
import { ThreeScatter } from 'three-scatter'

const scatter = new ThreeScatter(count, surface);
const positions = scatter.getPositions();

positions.forEach((pos) => {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(pos);
  scene.add(mesh);
});
```

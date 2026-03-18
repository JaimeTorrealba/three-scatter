---
title: Take Over Mode
description: Use ThreeScatter in take over mode to control your own objects and only get the scattered positions
---

# Take Over Mode

<DocsDemo>
    <TakeOver />
</DocsDemo>

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

## Take over with InstancedMesh

A very useful case is combining take over mode with [`THREE.InstancedMesh`](https://threejs.org/docs/#api/en/objects/InstancedMesh) for high-performance rendering of large numbers of objects. `ThreeScatter` provides the positions; you control the instanced rendering entirely.

```js
import { ThreeScatter } from 'three-scatter'
import { InstancedMesh, SphereGeometry, MeshStandardMaterial, Matrix4 } from 'three'

const COUNT = 200;
const matrix = new Matrix4();

const mesh = new InstancedMesh(
  new SphereGeometry(0.2, 8, 8),
  new MeshStandardMaterial({ color: 0x44aa88 }),
  COUNT
);
scene.add(mesh);

const scatter = new ThreeScatter(COUNT, surface);
scatter.getPositions().forEach((pos, i) => {
  matrix.makeTranslation(pos.x, pos.y, pos.z);
  mesh.setMatrixAt(i, matrix);
});
mesh.instanceMatrix.needsUpdate = true;
```

::: info
With `InstancedMesh` all copies share a single draw call regardless of count, making it ideal for foliage, rocks, or any repeated geometry at scale. Combine it with `setSeeds()` to regenerate positions and re-apply the matrices.
:::

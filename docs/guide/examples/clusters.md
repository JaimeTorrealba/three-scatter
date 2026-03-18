---
title: Clusters
description: Scatter groups of objects together as a single cluster unit
---

# Clusters

<DocsDemo>
    <Clusters />
</DocsDemo>

`ThreeScatter` accepts a `THREE.Group` as the model — every object inside the group is treated as a single unit, so the whole cluster is placed and oriented together at each scatter point.

```js
import { ThreeScatter } from 'three-scatter'
import { Group, Mesh, MeshStandardMaterial, CylinderGeometry, ConeGeometry } from 'three'

const trunk = new Mesh(new CylinderGeometry(0.2, 0.2, 1, 8), new MeshStandardMaterial({ color: 0x8b4513 }));
trunk.position.y = 0.5;

const leaves = new Mesh(new ConeGeometry(0.5, 1, 8), new MeshStandardMaterial({ color: 0x228b22 }));
leaves.position.y = 1.5;

const cluster = new Group();
cluster.add(trunk, leaves);

const scatter = new ThreeScatter(count, surface, cluster);
```

::: info
Any `THREE.Object3D` subclass works as the scatter model — `Group`, `Mesh`, or a loaded GLTF scene. When using a `Group`, each scattered copy is an independent clone of the entire group.
:::

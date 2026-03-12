---
title: API Reference
description: Full technical API reference for ThreeScatter — constructor, options, methods, and types
---

# API Reference

`ThreeScatter` extends [`THREE.Group`](https://threejs.org/docs/#api/en/objects/Group).

## Constructor

```ts
new ThreeScatter(count: number, base: BufferGeometry, mesh?: Mesh | Mesh[], options?: Options)
```

| Parameter | Type | Description |
|---|---|---|
| `count` | `number` | Number of objects to scatter. |
| `base` | `BufferGeometry` | The surface geometry to scatter on. |
| `mesh` | `Mesh \| Mesh[]` | Object or array of objects to scatter. Omit for take-over mode. |
| `options` | `Options` | Optional configuration (see below). |

## Options

```ts
interface Options {
  seeds?: number
  randomFn?: () => number
  useSkeletonUtils?: boolean
  distribution?: number[]
  debug?: boolean
  debugGeometry?: BufferGeometry
  debugMaterial?: Material
}
```

| Property | Type | Default | Description |
|---|---|---|---|
| `seeds` | `number` | `1` | Seed for the PRNG. Changing it produces a different but reproducible layout. |
| `randomFn` | `() => number` | `Math.random` | Custom random function. Must return a value in `[0, 1)`. |
| `useSkeletonUtils` | `boolean` | `false` | Clone meshes via `SkeletonUtils`. Required for models with rigging or skeletal animations. |
| `distribution` | `number[]` | `undefined` | Per-model probability weights. Length must match the `mesh` array and values must sum to `1`. |
| `debug` | `boolean` | `false` | Enable debug mode on construction. |
| `debugGeometry` | `BufferGeometry` | `SphereGeometry(0.5, 3, 2)` | Geometry used for debug proxy markers. |
| `debugMaterial` | `Material` | `MeshBasicMaterial({ color: 0x800080 })` | Material used for debug proxy markers. |

## Methods

### `setSeeds(seed?)`

```ts
setSeeds(seed?: number): void
```

Re-seeds the PRNG and repositions all scattered objects. Defaults to `1`.

---

### `setAll(callback)`

```ts
setAll(callback: (model: Object3D, index: number) => void): void
```

Iterates every scattered child and calls `callback` with the object and its index. Use this to apply per-object transforms (scale, rotation, etc.).

---

### `setAxis(x, y, z)`

```ts
setAxis(
  x: [min: number, max: number],
  y: [min: number, max: number],
  z: [min: number, max: number]
): void
```

Shows or hides objects based on the surface normal at their scatter point. Ranges are normalized between `-1` and `1`. Objects outside all three ranges are hidden.

---

### `alignToSurfaceNormal()`

```ts
alignToSurfaceNormal(): void
```

Rotates each scattered object so its `Y+` axis aligns with the face normal of the surface triangle it was placed on.

---

### `removeCollisions()`

```ts
removeCollisions(): void
```

Computes axis-aligned bounding boxes for all children and removes any object that intersects another.

---

### `setDebug()`

```ts
setDebug(): void
```

Hides all scattered objects and displays an `InstancedMesh` of low-poly proxies in their positions.

---

### `removeDebug()`

```ts
removeDebug(): void
```

Restores visibility of all scattered objects and hides the debug proxy mesh.

---

### `getFaces()`

```ts
getFaces(): Triangle[]
```

Returns all [`Triangle`](https://threejs.org/docs/#api/en/math/Triangle) faces extracted from the surface geometry.

---

### `getPositions()`

```ts
getPositions(): Vector3[]
```

Returns all sampled [`Vector3`](https://threejs.org/docs/#api/en/math/Vector3) positions. Useful in take-over mode to position your own objects.

---

### `cleanGroup()`

```ts
cleanGroup(): void
```

Disposes the geometry and material of every child mesh, then clears the group. Call this when removing a scatter instance from the scene.

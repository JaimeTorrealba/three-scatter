# Three scatter

> Inspired by a GScatter (plugin for blender) in Three.js

Spread all types of objects/models into a geometry easily

![Basic scene](./public/Multi_model.gif) BASIC SCENE

## Why to use it

Three.js already comes with [MeshSurfaceSampler](https://threejs.org/docs/?q=meshS#examples/en/math/MeshSurfaceSampler) you can think in `three-scatter` as an "extension" of it. I said it in quotes because is not quite true, `three-scatter` the approach is different and it comes with method to help scatter your Meshes.

Use `three-scatter` if you:
- Would like to scatter complex models (3D models with animations, rigging, etc)
- Want to align your model to the surface base, easily
- Would like to tweak in real-time (or with panels) seeds, or any property of your 3D model to scatter
- Want to remove object that have collisions, easily.
- Want to scatter on specific axis (for example only y+up).

::: info
if performance is your must, [MeshSurfaceSampler](https://threejs.org/docs/?q=meshS#examples/en/math/MeshSurfaceSampler) is your go to, I provided a debug option to help you, but [MeshSurfaceSampler](https://threejs.org/docs/?q=meshS#examples/en/math/MeshSurfaceSampler) is much more performance since you can (and probably should) use [InstancedMesh](https://threejs.org/docs/?q=InstancedMesh#api/en/objects/InstancedMesh)
:::

Additionally you can use this library to generate `only` random positions on your geometry.

## Installation

::: code-group

```bash [npm]
npm i @jaimebboyjt/three-scatter
```

```bash [yarn]
yarn add @jaimebboyjt/three-scatter
```

```bash [pnpm]
pnpm add @jaimebboyjt/three-scatter
```

:::

## Basic Usage

```js
import { ThreeScatter } from 'three-scatter'

// Count: Number of samples
// Surface: Geometry from which to sample
// Model: 3D model/mesh or models/meshes to scatter

const scatter = new ThreeScatter(count, surface, model);
scene.add(scatter);
```
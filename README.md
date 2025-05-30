# Three scatter

> Is my attempt to replicate a GScatter (plugin for blender) in Three.js

## Installation

```bash
pnpm i @jaimebboyjt/three-scatter
```

## Why to use it

Three.js already comes with [MeshSurfaceSampler](https://threejs.org/docs/?q=meshS#examples/en/math/MeshSurfaceSampler) you can think in `three-scatter` as an "extension" of it. I said it in quotes because is not quite true, `three-scatter` the approach is different and it comes with method to help scatter your Meshes.

Use `three-scatter` if you:
- Would like to scatter complex models (3D models with animations, rigging, etc)
- Want to align your model to the surface base, easily
- Would like to tweak in real-time (or with panels) seeds, or any property of your 3D model to scatter
- Want to remove collisions, easily.

NOTE:
if performance is your must, [MeshSurfaceSampler](https://threejs.org/docs/?q=meshS#examples/en/math/MeshSurfaceSampler) is your go to, I provided a debug option to help you, but [MeshSurfaceSampler](https://threejs.org/docs/?q=meshS#examples/en/math/MeshSurfaceSampler) is much more performance since you can (and probably should) use [InstancedMesh](https://threejs.org/docs/?q=InstancedMesh#api/en/objects/InstancedMesh)

## Demos



## How to use it

### Basic (constructor)

```js
import { ThreeScatter } from 'three-scatter'

// Surface: Geometry from which to sample
// Model: 3D model or models to scatter
// Count: Number of samples

const scatter = new ThreeScatter(surface, model, count);
scene.add(scatter);
```

You can also 

### Modifying all the 3D objects

`three-scatter` comes with lots of handy method for you, one of the most common ones is `setAll` that allow you affect all the scattered models.

```js
const scatter = new ThreeScatter(surface, [model1, model2, model3], count);

scatter.setAll((model, index) => {
  model.scale.set(0.1, 0.1, 0.1);
});
```

### Methods

#### setSeeds(seed: number)

```js
scatter.setSeeds(5); // tweak it and find the right value for you
```

#### Align models Y+up

```js
// This method will align Y+up with the normals of the surface
scatter.alignToSurfaceNormal();
```

#### Remove collisions

```js
// This method will remove the model that has collisions with other scattered model 
scatter.removeCollisions();
```

#### Clear group

```js
// Dispose all the geometries and material and remove all the meshes
scatter.cleanGroup();
```

#### Get faces

```js
// return all the faces of the surface sample, using a Triangle: https://threejs.org/docs/?q=triangle#api/en/math/Triangle
scatter.getFaces();
```

#### Get positions

```js
// return all the positions, useful if you want to display specifics positions in your scene
scatter.getPositions();
```

### Options

ThreeScatter allows you more control using optional parameters.

```ts
const scatter = new ThreeScatter(surface, model, count, {
  seeds<number>: 1, // seed to begin with
  useSkeletonUtils<boolean>: true // Necessary when you are scattering 3D models with rigging/animations
  randomFn<() => number>: Math.random() // if you want to have control over the random function, has to return a value from 0 to 1
});
```

### Debug mode

ThreeScatter comes with a debug mode that will replace all your models with a low poly mesh, and find the right position, easily.

```ts
const scatter = new ThreeScatter(surface, model, count, {
  debug<boolean>: true,
  debugGeometry<Geometry>: new THREE.SphereGeometry(0.5, 3, 2) ,
  debugMaterial<Material>: new THREE.MeshBasicMaterial({ color: 0x800080 }),
});
```

You can also use the `setDebug` and `removeDebug` methods to control it after `ThreeScatter` is instantiated

```js
scatter.setDebug(); // or
scatter.removeDebug();
```

## TODO
- [] Distribution (when more than one model to scatter) should be base on %
- [] Distribution by axis (base on the normals)
- [] Avoid corners
- [] Density
- [] Merge geometries?


## Contributing

We are open to contributions, please read the [contributing guide](/CONTRIBUTING.md) to get started.

## License

[MIT](/LICENSE)

## Sponsors

Be the first to support this project [here](LINK) ☺️.

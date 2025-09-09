# Three scatter

> Inspired by a GScatter (plugin for blender) in Three.js

Spread all types of objects/models into a geometry easily

![Demo GIF](./public/Multi_model.gif)

## Installation

```bash
npm i @jaimebboyjt/three-scatter
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

Additionally you can use this library to generate only the positions

## Quick Demos

- Multi-models: https://stackblitz.com/edit/vitejs-vite-kebufehm?file=package.json
- Animated models: https://stackblitz.com/edit/vitejs-vite-7fz6pccr?file=src%2Fmain.js
- TresJs (Vue.js): https://stackblitz.com/edit/vitejs-vite-qpspyyen?file=src%2Fcomponents%2FTheExperience.vue
- R3F (React): https://stackblitz.com/edit/vitejs-vite-iulmyhla?file=src%2Fmain.jsx
- Takeover-mode (instanceMesh): https://stackblitz.com/edit/vitejs-vite-t3n4aqgb?file=src%2Fmain.js
- Takeover-mode (custom meshes): https://stackblitz.com/edit/vitejs-vite-5cvelshk?file=src%2Fmain.js
- Grouping: https://stackblitz.com/edit/vitejs-vite-cvbdyztz?file=src%2Fmain.js

## How to use it

### Basic (constructor)

```js
import { ThreeScatter } from 'three-scatter'

// Count: Number of samples
// Surface: Geometry from which to sample
// Model: 3D model or models to scatter

const scatter = new ThreeScatter(count, surface, model);
scene.add(scatter);
```

You can also scatter more than one model:

```js
const scatter = new ThreeScatter(count, surface, [model1, model2]);
```

### Modifying all the 3D objects

`three-scatter` comes with lots of handy method for you, one of the most common ones is `setAll` that allow you affect all the scattered models.

```js
const scatter = new ThreeScatter(count, surface, [model1, model2, model3]);

scatter.setAll((model, index) => {
  model.scale.set(0.1, 0.1, 0.1);
});
```

### Take over mode

If you don't need  `ThreeScatter` handle your models you can instantiate the class without any models, then get the positions:

```js
const scatter = new ThreeScatter(count, surface);
const positions = scatter.getPositions()
```

you can still get different positions using the `setSeeds` method but you have to update your models manually.

NOTE: Using this approach means that no other internal method will have effects in your model

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
const scatter = new ThreeScatter(count, surface, model, {
  seeds<number>: 1, // seed to begin with
  useSkeletonUtils<boolean>: true // Necessary when you are scattering 3D models with rigging/animations
  randomFn<() => number>: Math.random() // if you want to have control over the random function, has to return a value from 0 to 1
});
```

### Debug mode

`ThreeScatter` comes with a debug mode that will replace all your models with a low poly mesh, and find the right position, easily.

```ts
const scatter = new ThreeScatter(count, surface, model, {
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

### Distribution

You can now set the percentage of model distribution in case you are scattering more than one model.

```js
const scatter = new ThreeScatter(count, surface, [model1, model2], {
  distribution: [ 0.25, 0.75]
});
```

NOTE:
In order to set the distribution property, you need to have:
1. An array of models
2. A `distribution` property with equal length than the array of model
3. All the numbers inside the `distribution` property needs to sum 1


## TODO
- [x] Distribution (when more than one model to scatter) should be base on %
- [] Distribution by axis (base on the normals)
- [] Avoid corners
- [] Density
- [] Merge geometries?
- [] Clusters


## Contributing

We are open to contributions, please read the [contributing guide](/CONTRIBUTING.md) to get started.

## License

[MIT](/LICENSE)

## Sponsors

Be the first to support this project [here](LINK) ☺️.

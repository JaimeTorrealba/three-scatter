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

## Docs
TODO add docs link
- Multi-models: https://stackblitz.com/edit/vitejs-vite-kebufehm?file=package.json
- Animated models: https://stackblitz.com/edit/vitejs-vite-7fz6pccr?file=src%2Fmain.js
- TresJs (Vue.js): https://stackblitz.com/edit/vitejs-vite-qpspyyen?file=src%2Fcomponents%2FTheExperience.vue
- R3F (React): https://stackblitz.com/edit/vitejs-vite-iulmyhla?file=src%2Fmain.jsx
- Takeover-mode (instanceMesh): https://stackblitz.com/edit/vitejs-vite-t3n4aqgb?file=src%2Fmain.js
- Takeover-mode (custom meshes): https://stackblitz.com/edit/vitejs-vite-5cvelshk?file=src%2Fmain.js
- Grouping: https://stackblitz.com/edit/vitejs-vite-cvbdyztz?file=src%2Fmain.js

### Methods

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


## Contributing

We are open to contributions, please read the [contributing guide](/CONTRIBUTING.md) to get started.

## License

[MIT](/LICENSE)

## Sponsors

Be the first to support this project [here](LINK) ☺️.

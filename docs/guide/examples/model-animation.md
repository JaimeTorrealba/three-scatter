---
title: Model Animation
description: Scatter animated 3D models with rigging using ThreeScatter
---

# Model Animation

<DocsDemo>
    <ModelAnimation />
</DocsDemo>

`ThreeScatter` supports scattering 3D models that include animations and rigging. Enable skeleton utils via the `useSkeletonUtils` option so clones are handled correctly:

```js
import { ThreeScatter } from 'three-scatter'

const scatter = new ThreeScatter(count, surface, animatedModel, {
  useSkeletonUtils: true,
});
```

> **Note:** `useSkeletonUtils` is required whenever your model has rigging or skeletal animations.

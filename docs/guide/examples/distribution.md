---
title: Distribution
description: Control the percentage of each model when scattering multiple objects
---

# Distribution

DEMO

When scattering more than one model you can define how each model is distributed across the surface using the `distribution` option.

```js
import { ThreeScatter } from 'three-scatter'

const scatter = new ThreeScatter(count, surface, [model1, model2], {
  distribution: [0.25, 0.75],
});
```

::: info
In order to set the distribution property, you need to have:
1. An array of models
2. A `distribution` property with equal length than the array of model
3. All the numbers inside the `distribution` property needs to sum 1
:::

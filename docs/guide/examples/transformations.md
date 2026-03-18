---
title: Transformations
description: how to apply transformation to the scattered objects
---

# Transformations

## Modifying the whole group

`three-scatter` extend from [`THREE.Group`](https://threejs.org/docs/?q=group#Group) and you can apply affine transformation to the whole group.

```js{4}
import { ThreeScatter } from 'three-scatter'

const scatter = new ThreeScatter(count, surface, model);
scatter.scale.set(0.5,0.5,0.5);
```


## Modifying individuals models

<DocsDemo>
    <TransformationsIndividual />
</DocsDemo>

`three-scatter` provides `setAll` method that allow you affect all the scattered models.

```js{5-8}
import { ThreeScatter } from 'three-scatter'

const scatter = new ThreeScatter(count, surface, [model1, model2, model3]);

scatter.setAll((model, index) => {
  const random = Math.random()
  model.rotation.set(random, random, random);
});
```

> **Note:** you can get creative and changing transformations or parameters in individuals scattered objects.

## Modifying a specific models


```js{5-8}
import { ThreeScatter } from 'three-scatter'

const scatter = new ThreeScatter(count, surface, [model1, model2, model3]);

scatter.setAll((model, _) => {
  // Applying transformation to a specific object
  model[0].rotation.set(0.5, 0.5, 0.5);
});
```
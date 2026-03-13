---
title: Transformations
description: how to apply transformation to the scattered objects
---

# Transformations

## Modifying the whole group

`three-scatter` extend from [`THREE.Group`](https://threejs.org/docs/?q=group#Group) and you can apply affine transformation to the whole group.

<DocsDemo src="/demos/transformations-group.html" />

```js{4}
import { ThreeScatter } from 'three-scatter'

const scatter = new ThreeScatter(count, surface, model);
scatter.scale.set(0.5,0.5,0.5);
```


## Modifying individuals models

<DocsDemo src="/demos/transformations-individual.html" />

`three-scatter` provides `setAll` method that allow you affect all the scattered models.

```js{5-8}
import { ThreeScatter } from 'three-scatter'

const scatter = new ThreeScatter(count, surface, [model1, model2, model3]);

scatter.setAll((model, index) => {
  const random = Math.random()
  model.rotation.set(random, random, random);
});
```
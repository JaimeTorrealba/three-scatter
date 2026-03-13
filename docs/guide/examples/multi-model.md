---
title: Scattering Multiples objects
description: Simple example how to scatter more than one object
---

# Scattering multiples objects

<DocsDemo src="/demos/multi-model.html" />

You can also scatter more than one model/mesh just by passing an array to the constructor

```js{4}
import { ThreeScatter } from 'three-scatter'

const scatter = new ThreeScatter(count, surface, [model1, model2]);
scene.add(scatter);
```
---
title: Seeds
description: Use seeds to get reproducible and tweakable scatter layouts
---

# Seeds

<DocsDemo>
    <Seeds />
</DocsDemo>

Seeds allow you to control the randomness of the scatter. By tweaking the seed value you can find the layout that best fits your scene.

```js
import { ThreeScatter } from 'three-scatter'

const scatter = new ThreeScatter(count, surface, model, {
  seeds: 1,
});
```

You can also set a seed after instantiation using the `setSeeds` method:

```js
scatter.setSeeds(5); // tweak it to find the right value for you
```

> **Note:** When using [Take Over Mode](/guide/examples/take-over), changing the seed requires you to update your models manually.

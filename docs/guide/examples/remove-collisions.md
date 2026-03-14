---
title: Remove Collisions
description: Automatically remove scattered objects that collide with each other
---

# Remove Collisions

<DocsDemo>
    <RemoveCollisions />
</DocsDemo>

`ThreeScatter` can detect and remove objects that collide with other scattered objects. Call `removeCollisions` after instantiation:

```js
import { ThreeScatter } from 'three-scatter'

const scatter = new ThreeScatter(count, surface, model);
scatter.removeCollisions();
```

---
title: Display by Axis
description: Show or hide scattered objects based on a normalized range along each axis
---

# Display by Axis

<DocsDemo>
    <DisplayByAxis />
</DocsDemo>

You can control which scattered objects are visible by filtering them along the X, Y, and Z axes. Ranges are normalized between `-1` and `1`.

```js
import { ThreeScatter } from 'three-scatter'

const scatter = new ThreeScatter(count, surface, model);

scatter.setAxis(
  [minX, maxX],
  [minY, maxY],
  [minZ, maxZ]
);
```

For example, to show only objects in the upper half of the Y axis:

```js
scatter.setAxis([-1, 1], [0, 1], [-1, 1]);
```

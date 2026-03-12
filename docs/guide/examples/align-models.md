---
title: Align Objects to Surface
description: Align scattered objects to the surface normal so they orient correctly on any geometry
---

# Align Objects to Surface

DEMO

By default, scattered objects keep their original orientation. Call `alignToSurfaceNormal` to align each object's Y+ axis with the normal of the surface at its scatter point.

```js
import { ThreeScatter } from 'three-scatter'

const scatter = new ThreeScatter(count, surface, model);
scatter.alignToSurfaceNormal();
```

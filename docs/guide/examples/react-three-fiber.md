---
title: React Three Fiber
description: Use ThreeScatter with React Three Fiber
---

# React Three Fiber

[Open demo on StackBlitz](https://stackblitz.com/edit/vitejs-vite-xdwzuwxi?file=src%2Fmain.jsx)

`ThreeScatter` works seamlessly with [React Three Fiber](https://docs.pmnd.rs/react-three-fiber). Create the scatter inside a `useEffect` (or `useLayoutEffect`) and attach it directly to the Three.js scene.

```jsx
import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { ThreeScatter } from 'three-scatter'

export function ScatterScene() {
  const { scene } = useThree()
  const { scene: model } = useGLTF('/model.glb')
  const surfaceRef = useRef()

  useEffect(() => {
    if (!surfaceRef.current) return
    const scatter = new ThreeScatter(100, surfaceRef.current.geometry, model)
    scatter.alignToSurfaceNormal()
    scene.add(scatter)
    return () => {
      scatter.cleanGroup()
      scene.remove(scatter)
    }
  }, [model, scene])

  return <mesh ref={surfaceRef}>
    <sphereGeometry args={[5, 32, 32]} />
    <meshStandardMaterial visible={false} />
  </mesh>
}
```

::: info
Return a cleanup function from `useEffect` that calls `cleanGroup()` and removes the scatter from the scene. This avoids memory leaks and duplicate scatters on hot-reload or component unmount.
:::

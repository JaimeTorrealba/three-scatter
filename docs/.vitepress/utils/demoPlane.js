import { Mesh, MeshStandardMaterial, PlaneGeometry } from 'three';

export const createPlane = (scene) => {
      const geometry = new PlaneGeometry(15,15, 50,50);
  const material = new MeshStandardMaterial({ color: 0xe4e4e4 });
  const plane = new Mesh(geometry, material);
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);
  return plane;
}
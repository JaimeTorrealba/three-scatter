import { Mesh, MeshStandardMaterial, SphereGeometry } from 'three';

export const createSphere = (scene) => {
      const geometry = new SphereGeometry(5, 32);
  const material = new MeshStandardMaterial({ color: 0xe4e4e4 });
  const sphere = new Mesh(geometry, material);
  scene.add(sphere);
  return sphere;
}
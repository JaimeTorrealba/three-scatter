import type { BufferGeometry, Material,Triangle } from 'three';
import { Mesh } from 'three';

export class MeshWithTriangle extends Mesh {
    _triangle?: Triangle;
}
/*
Base: geometry to scatter on
Mesh: mesh or meshes to scatter
Count: number of meshes to scatter
Options:
    debug: enable debug mode; hides scattered meshes and shows instanced debug markers
    debugGeometry: geometry used for debug markers when debug is enabled
    debugMaterial: material used for debug markers when debug is enabled
    seeds: PRNG seed for deterministic sampling across faces
    randomFn: function returning a number in [0,1) to drive randomness
    useSkeletonUtils: clone meshes via SkeletonUtils to preserve skeletons/skins
    distribution: probabilities per mesh for multi-mesh sampling; must sum to 1
*/

export interface Options {
    debug?: boolean;
    debugGeometry?: BufferGeometry;
    debugMaterial?: Material;
    seeds?: number;
    randomFn?: () => number;
    useSkeletonUtils?: boolean; // if true, use SkeletonUtils to clone the mesh
    distribution?: number[];
}
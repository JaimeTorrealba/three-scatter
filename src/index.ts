import { BufferGeometry, Mesh, Group, Triangle, Material, Object3D, Box3, Vector3, Quaternion, SphereGeometry, MeshBasicMaterial, InstancedMesh } from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import alea from 'alea';

import { blueNoise2D, extractFaces, generateRandomPointInTriangle } from './utils';
import type { Options, MeshWithTriangle } from './types';

class ThreeScatter extends Group {
    count: number;
    base: BufferGeometry;
    mesh?: Mesh | Mesh[];
    // options
    seeds: number;
    randomFn: () => number;
    useSkeletonUtils: boolean;
    // debug
    debug: boolean;
    debugGeometry: BufferGeometry | undefined;
    debugMaterial: Material | undefined;
    instancedMesh: InstancedMesh | undefined;
    distribution: number[] | undefined;
    // internals
    precision: number;
    prng: () => number;
    faces: Triangle[];
    positions: Vector3[];
    noise: number;

    constructor(count: number, base: BufferGeometry, mesh: Mesh, options: Options = {}) {
        super();
        this.base = base;
        this.mesh = mesh;
        this.count = count;

        // options

        this.seeds = options.seeds ?? 1;
        this.randomFn = options.randomFn || Math.random;
        this.useSkeletonUtils = options.useSkeletonUtils ?? false;

        // debug
        this.debug = options.debug ?? false;
        this.debugGeometry = options.debugGeometry
        this.debugMaterial = options.debugMaterial
        this.instancedMesh = undefined
        this.distribution = options.distribution;

        //internals
        this.precision = 2;
        this.prng = alea(this.seeds);
        this.noise = blueNoise2D(this.precision, -this.precision, this.prng());
        this.faces = [];
        this.positions = [];
        this.sample()

        if (this.debug) {
            this.setDebug()
        }
    }
    sample() {
        let sampleMesh;
        // Extract faces from base model
        this.faces = extractFaces(this.base);

        // If no mesh provided
        if (!this.mesh) {
            for (let i = 0; i < this.count; i++) {
                generateRandomPointInTriangle(this.faces, this.randomFn, this.prng, this.precision, this.positions);
            }
            return
        }

        // If only one model
        if (!Array.isArray(this.mesh)) {
            for (let i = 0; i < this.count; i++) {
                const randomPoint = generateRandomPointInTriangle(this.faces, this.randomFn, this.prng, this.precision, this.positions);
                sampleMesh = this.useSkeletonUtils ? SkeletonUtils.clone(this.mesh) : this.mesh.clone();
                sampleMesh.position.set(randomPoint.x, randomPoint.y, randomPoint.z);
                sampleMesh.name = `scatter_${i}`;
                (sampleMesh as MeshWithTriangle)._triangle = randomPoint.triangle;
                this.add(sampleMesh);
            }
            return;
        }
        // If multiple models but no distribution provided
        if (!this.distribution) {
            for (let i = 0; i < this.count; i++) {
                let meshIndex = 0;
                meshIndex = i % this.mesh.length;
                sampleMesh = this.useSkeletonUtils ? SkeletonUtils.clone(this.mesh[meshIndex]) : this.mesh[meshIndex].clone();
                const randomPoint = generateRandomPointInTriangle(this.faces, this.randomFn, this.prng, this.precision, this.positions);
                sampleMesh.position.set(randomPoint.x, randomPoint.y, randomPoint.z);
                sampleMesh.name = `scatter_${i}`;
                (sampleMesh as MeshWithTriangle)._triangle = randomPoint.triangle;

                this.add(sampleMesh);
            }
            return;
        }
        // If distribution is provided
        if (this.mesh.length !== this.distribution.length) {
            throw new Error('Distribution array length must match mesh array length');
        }
        const _sum = this.distribution.reduce((acc, val) => acc + val, 0);
        if (Math.abs(_sum - 1) > 1e-6) {
            throw new Error('Distribution array elements must sum to 1');
        }

        for (let i = 0; i < this.count; i++) {
            const randomPoint = generateRandomPointInTriangle(this.faces, this.randomFn, this.prng, this.precision, this.positions);
            let meshIndex = 0;

            // Calculate cumulative distribution
            const cumulative = [];
            let sum = 0;
            for (let d of this.distribution) {
                sum += d;
                cumulative.push(sum);
            }
            const r = this.randomFn();
            meshIndex = cumulative.findIndex(c => r < c);
            if (meshIndex === -1) meshIndex = this.mesh.length - 1;
            sampleMesh = this.useSkeletonUtils ? SkeletonUtils.clone(this.mesh[meshIndex]) : this.mesh[meshIndex].clone();
            sampleMesh.position.set(randomPoint.x, randomPoint.y, randomPoint.z);
            sampleMesh.name = `scatter_${i}`;
            (sampleMesh as MeshWithTriangle)._triangle = randomPoint.triangle;
            this.add(sampleMesh);
        }
        return this
    }
    #sampleDebug() {
        this.debugGeometry = this.debugGeometry ?? new SphereGeometry(0.5, 3, 2);
        this.debugMaterial = this.debugMaterial ?? new MeshBasicMaterial({ color: 0x800080 });
        this.instancedMesh = new InstancedMesh(this.debugGeometry, this.debugMaterial, this.count);

        const dummy = new Object3D();
        for (let index = 0; index < this.count; index++) {
            const currentPos = this.children[index].position;
            dummy.position.set(currentPos.x, currentPos.y, currentPos.z);
            dummy.updateMatrix();
            this.instancedMesh.setMatrixAt(index, dummy.matrix);
        }
        this.instancedMesh.instanceMatrix.needsUpdate = true;
        this.add(this.instancedMesh);
    }
    setDebug() {
        this.debug = true;
        this.children.forEach((child) => {
            child.visible = false;
        })
        if (!this.instancedMesh) {
            this.#sampleDebug()
            return
        } else {
            this.instancedMesh.visible = true;
        }
    }
    removeDebug() {
        this.debug = false;
        this.children.forEach((child) => {
            child.visible = true;
        })
        if (this.instancedMesh) {
            this.instancedMesh.visible = false;
        }
    }

    setSeeds(seed = 1) {
        this.prng = alea(seed);
        this.noise = blueNoise2D(0, 1, this.prng());
        this.children.forEach((child) => {
            if (child instanceof InstancedMesh) return
            const randomPoint = generateRandomPointInTriangle(this.faces, this.randomFn, this.prng, this.precision, this.positions);
            (child as Mesh).position.set(randomPoint.x, randomPoint.y, randomPoint.z);
            (child as MeshWithTriangle)._triangle = randomPoint.triangle;
        })
        if (this.instancedMesh) {
            const dummy = new Object3D();
            for (let index = 0; index < this.count; index++) {
                const currentPos = this.children[index].position;
                dummy.position.set(currentPos.x, currentPos.y, currentPos.z);
                dummy.updateMatrix();
                this.instancedMesh.setMatrixAt(index, dummy.matrix);
            }
            this.instancedMesh.instanceMatrix.needsUpdate = true;
        }
    }
    setAll(callback: (model: Object3D, index: number) => void) {
        this.children.forEach((child, index) => {
            callback(child, index);
        });
    }
    setAxis(x: [min: number, max: number], y: [min: number, max: number], z: [min: number, max: number]) {
        this.children.forEach((child) => {
            const triangle = (child as MeshWithTriangle)._triangle;
            if (triangle) {
                const normal = triangle.getNormal(new Vector3());
                const [minX, maxX] = x;
                const [minY, maxY] = y;
                const [minZ, maxZ] = z;
                if (normal.y >= minY && normal.y <= maxY) {
                    child.visible = true;
                } else if (normal.x >= minX && normal.x <= maxX) {
                    child.visible = true;
                } else if (normal.z >= minZ && normal.z <= maxZ) {
                    child.visible = true;
                } else {
                    child.visible = false;
                }
            }
        });
    }
    removeCollisions() {
        const meshes = this.children;
        const collisions = [];
        for (let i = 0; i < meshes.length; i++) {
            for (let j = i + 1; j < meshes.length; j++) {
                const bbox1 = new Box3().setFromObject(meshes[i]);
                const bbox2 = new Box3().setFromObject(meshes[j]);
                const mesh2 = meshes[j];
                if (bbox1.intersectsBox(bbox2)) {
                    collisions.push(mesh2);
                }
            }
        }
        collisions.forEach((collision) => {
            this.remove(collision);
        })
    }
    alignToSurfaceNormal() {
        this.children.forEach((child) => {
            const triangle = (child as MeshWithTriangle)._triangle;
            if (triangle) {
                const normal = triangle.getNormal(new Vector3());
                const quat = new Quaternion();
                quat.setFromUnitVectors(new Vector3(0, 1, 0), normal.normalize());
                child.quaternion.copy(quat);
            }
        })
    }
    cleanGroup() {
        this.children.forEach((child) => {
            if ((child as Mesh).isMesh) {
                const mesh = child as Mesh;
                mesh.geometry.dispose();
                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach(mat => mat.dispose());
                } else {
                    mesh.material.dispose();
                }
            }
        })
        this.clear();
    }
    getFaces() {
        return this.faces;
    }
    getPositions() {
        return this.positions;
    }

}

export { ThreeScatter };
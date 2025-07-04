import { BufferGeometry, Mesh, Group, Triangle, Material, Object3D, Box3, Vector3, Quaternion, SphereGeometry, MeshBasicMaterial } from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { createNoise2D } from 'simplex-noise'
import alea from 'alea';
import { InstancedMesh2 } from '@three.ez/instanced-mesh';

// Extend Mesh to include _triangle property
class MeshWithTriangle extends Mesh {
    _triangle?: Triangle;
}
/*
Base: geometry to scatter on
Mesh: mesh or meshes to scatter
Count: number of meshes to scatter
Options:
    precision: number of decimal places to round the random point to
    default random function: for faces? 0 - 1 range
*/

interface Options {
    debug?: boolean;
    debugGeometry?: BufferGeometry;
    debugMaterial?: Material;
    seeds?: number;
    randomFn?: () => number;
    useSkeletonUtils?: boolean; // if true, use SkeletonUtils to clone the mesh
    distribution?: number[];
}

class ThreeScatter extends Group {
    base: BufferGeometry;
    mesh: Mesh | Mesh[];
    count: number;
    // options
    seeds: number;
    randomFn: () => number;
    useSkeletonUtils: boolean;
    // debug
    debug: boolean;
    debugGeometry: BufferGeometry | undefined;
    debugMaterial: Material | undefined;
    instancedMesh: InstancedMesh2 | undefined;
    distribution: number[] | undefined;
    // internals
    precision: number;
    faces: Triangle[];
    noise: (x: number, y: number) => number;

    constructor(base: BufferGeometry, mesh: Mesh, count: number, options: Options = {}) {
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
        const prng = alea(this.seeds);
        this.noise = createNoise2D(prng);
        this.faces = [];
        this.sample()

        if (this.debug) {
            this.setDebug()
        }
    }
    #generateRandomPointInTriangle(index: number) {
        const randomTriangle = this.faces[Math.floor(this.randomFn() * this.faces.length)];
        let r1 = Math.abs(+this.noise(index, 0).toFixed(this.precision));
        let r2 = Math.abs(+this.noise(0, index).toFixed(this.precision));
        if (r1 + r2 > 1) {
            r1 = 1 - r1;
            r2 = 1 - r2;
        }

        const v1 = randomTriangle.a;
        const v2 = randomTriangle.b;
        const v3 = randomTriangle.c;

        const randomPoint = {
            x: (1 - r1 - r2) * v1.x + r1 * v2.x + r2 * v3.x,
            y: (1 - r1 - r2) * v1.y + r1 * v2.y + r2 * v3.y,
            z: (1 - r1 - r2) * v1.z + r1 * v2.z + r2 * v3.z,
            triangle: randomTriangle
        };
        return randomPoint;
    }
    sample() {
        const _face = new Triangle();
        const positionAttribute = this.base.getAttribute('position');
        const indexAttribute = this.base.index;
        const totalFaces = indexAttribute ? (indexAttribute.count / 3) : (positionAttribute.count / 3);
        let sampleMesh;
        // Extract faces from base model
        for (let i = 0; i < totalFaces; i++) {

            let i0 = 3 * i;
            let i1 = 3 * i + 1;
            let i2 = 3 * i + 2;

            if (indexAttribute) {

                i0 = indexAttribute.getX(i0);
                i1 = indexAttribute.getX(i1);
                i2 = indexAttribute.getX(i2);

            }

            _face.a.fromBufferAttribute(positionAttribute, i0);
            _face.b.fromBufferAttribute(positionAttribute, i1);
            _face.c.fromBufferAttribute(positionAttribute, i2);

            this.faces.push(_face.clone());

        }

        // If only one model
        if (!Array.isArray(this.mesh)) {
            for (let i = 0; i < this.count; i++) {
                const randomPoint = this.#generateRandomPointInTriangle(i);
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
                const randomPoint = this.#generateRandomPointInTriangle(i);
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
            const randomPoint = this.#generateRandomPointInTriangle(i);
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
        this.instancedMesh = new InstancedMesh2(this.debugGeometry, this.debugMaterial, { capacity: this.count, createEntities: true });

        this.instancedMesh.addInstances(this.count, (obj, index) => {
            const currentPos = this.children[index].position;
            obj.position.set(currentPos.x, currentPos.y, currentPos.z);
        });
        this.add(this.instancedMesh as unknown as Object3D);
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
        this.noise = createNoise2D(alea(seed));
        this.children.forEach((child, i) => {
            if (child instanceof InstancedMesh2) return
            const randomPoint = this.#generateRandomPointInTriangle(i);
            (child as Mesh).position.set(randomPoint.x, randomPoint.y, randomPoint.z);
            (child as MeshWithTriangle)._triangle = randomPoint.triangle;
        })
        if (this.instancedMesh) {
            this.instancedMesh.instances.forEach((_instance, index) => {
                const currentPos = this.children[index].position;
                _instance.position.set(currentPos.x, currentPos.y, currentPos.z)
                _instance.updateMatrix()
            })
        }
    }
    setAll(callback: (model: Object3D, index: number) => void) {
        this.children.forEach((child, index) => {
            callback(child, index);
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
        return this.children.map((child) => {
            const mesh = child as Mesh;
            return mesh.position;
        });
    }

}

export { ThreeScatter };
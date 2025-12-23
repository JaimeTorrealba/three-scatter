import { BufferGeometry, Mesh, Group, Triangle, Material, Object3D, Box3, Vector3, Quaternion, SphereGeometry, MeshBasicMaterial, InstancedMesh } from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { createNoise2D } from 'simplex-noise'
import alea from 'alea';

// Extend Mesh to include _triangle property
class MeshWithTriangle extends Mesh {
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
    faces: Triangle[];
    positions: Vector3[];
    noise: (x: number, y: number) => number;

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
        const prng = alea(this.seeds);
        this.noise = createNoise2D(prng);
        this.faces = [];
        this.positions = [];
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
        this.positions.push(new Vector3(randomPoint.x, randomPoint.y, randomPoint.z));
        return randomPoint;
    }
    #extractFaces() {
        const _face = new Triangle();
        const positionAttribute = this.base.getAttribute('position');
        const indexAttribute = this.base.index;
        const totalFaces = indexAttribute ? (indexAttribute.count / 3) : (positionAttribute.count / 3);
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
    }
    sample() {
        let sampleMesh;
        // Extract faces from base model
        this.#extractFaces();

        // If no mesh provided
        if (!this.mesh) {
            for (let i = 0; i < this.count; i++) {
                this.#generateRandomPointInTriangle(i);
            }
            return
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
        this.noise = createNoise2D(alea(seed));
        this.children.forEach((child, i) => {
            if (child instanceof InstancedMesh) return
            const randomPoint = this.#generateRandomPointInTriangle(i);
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
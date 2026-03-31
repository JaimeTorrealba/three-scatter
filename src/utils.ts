import { BufferGeometry, Triangle, Vector3 } from "three";

export const blueNoise2D = (x: number, y: number, seed = 0) => {
    let n = x * 374761393 + y * 668265263 + seed * 69069;
    n = (n ^ (n >> 13)) * 1274126177;
    return ((n ^ (n >> 16)) >>> 0) / 4294967296;
}


export const extractFaces = (base: BufferGeometry) => {
    const _faces: Triangle[] = [];
    const _face = new Triangle();
    const positionAttribute = base.getAttribute('position');
    const indexAttribute = base.index;
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

        _faces.push(_face.clone());

    }
    return _faces;
}

export const generateRandomPointInTriangle = (faces: Triangle[], randomFn: () => number, prng: () => number, precision: number, positions: Vector3[]) => {
    const randomTriangle = faces[Math.floor(randomFn() * faces.length)];
    let r1 = blueNoise2D(precision, -precision, prng());
    let r2 = blueNoise2D(precision, -precision, prng());

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
    positions.push(new Vector3(randomPoint.x, randomPoint.y, randomPoint.z));
    return randomPoint;
}
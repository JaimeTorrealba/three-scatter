import { AmbientLight, DirectionalLight } from 'three'

export const createLights = (scene) => {
    const ambient = new AmbientLight(0xffffff, 0.7)
    const dir = new DirectionalLight(0xffffff, 1.2)
    dir.position.set(8, 12, 8)
    scene.add(dir, ambient)

    return { ambient, dir }
}
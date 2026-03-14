import { OrbitControls } from 'three/addons/controls/OrbitControls'

export const createOrbitControls = (camera, canvas) => {
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    return controls
}
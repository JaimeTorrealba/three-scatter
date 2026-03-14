import { PerspectiveCamera } from 'three'
export const createCamera = (scene) => {
    const container = document.getElementById('webGl').parentElement
    const camera = new PerspectiveCamera(75, container.clientWidth / container.clientHeight)
    camera.position.z = 15
    scene.add(camera)

    window.addEventListener("resize", () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
    });
    return camera
}
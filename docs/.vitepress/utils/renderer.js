import { WebGLRenderer } from 'three'

export const createRenderer = () => {
    const canvas = document.getElementById('webGl')
    const container = canvas.parentElement
    const renderer = new WebGLRenderer({ canvas: canvas, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor('#444')
    renderer.setSize(container.clientWidth, container.clientHeight)

    window.addEventListener("resize", () => {
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    return renderer
}
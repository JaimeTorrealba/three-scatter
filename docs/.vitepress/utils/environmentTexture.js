import { PMREMGenerator } from "three";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";

export const createEnvironmentTexture = (scene, renderer) => {
    const url = "/DaySky.exr";
    const pmremGenerator = new PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    new EXRLoader().load(url, (texture) => {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        scene.background = envMap;
        scene.environment = envMap;
        pmremGenerator.dispose();
        texture.dispose();
    });
};
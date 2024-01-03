import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class ScenarioModelsController {
    constructor(scene) {
        this.scene = scene;
        this.build();
    }

    build(){
        const loader = new GLTFLoader().setPath('models/');

        loader.load('buildings.glb', async (gltf) => {
            const model = gltf.scene;
            model.traverse(function (object){
              if (object.isMesh) object.castShadow = true;
            });


            model.rotation.y = -Math.PI/2;
            model.position.set(6000, 340, -4500);
            model.scale.set(1500.0, 1500.0, 1500.0);
            this.scene.add(model);
            const model2 = gltf.scene.clone();
            model2.traverse(function (object){
              if (object.isMesh) object.castShadow = true;
            });
            model2.rotation.y = -Math.PI/2;
            model2.position.set(-6000, 340, -4500);
            model2.scale.set(1500.0, 1500.0, 1500.0);
            this.scene.add(model2);

          });

          loader.load('buildings2.glb', async (gltf) => {

            const model = gltf.scene;
            model.traverse(function (object){
              if (object.isMesh) object.castShadow = true;
            });
            model.position.set(-14000, 1360, -25000);
            model.scale.set(-70000.0, 70000.0, 70000.0);
            this.scene.add(model);
            const model2 = gltf.scene.clone();
            model2.traverse(function (object){
              if (object.isMesh) object.castShadow = true;
            });
            model2.position.set(14000, 1390, 25500);
            model2.scale.set(71000.0, 71000.0, -71000.0);
            this.scene.add(model2);

          });
    }
} export { ScenarioModelsController };
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class ScenarioModelsController {
    constructor(scene) {
        this.scene = scene;
        this.build();
    }

    build(){
        const loader = new GLTFLoader().setPath('models/');

/*
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
            var target = new THREE.Vector3();
            console.log("position", model.getWorldPosition(target));

          });
          */

          const geometry = new THREE.PlaneGeometry(9700, 2500);
          const material = new THREE.MeshPhongMaterial({color: 0x000000});
          material.side = THREE.DoubleSide;
          const backPlane = new THREE.Mesh(geometry, material);
          backPlane.position.y = 1000;
          backPlane.position.z = -6500;
          backPlane.position.x = -500;

          material.side = THREE.DoubleSide;
          const frontPlane = new THREE.Mesh(geometry, material);
          frontPlane.position.y = 1000;
          frontPlane.position.z = 6900;
          frontPlane.position.x = -100;

          const geometry2 = new THREE.PlaneGeometry(15000, 2500);
          const material2 = new THREE.MeshPhongMaterial({color: 0x000000});
          material2.side = THREE.DoubleSide;
          const leftPlane = new THREE.Mesh(geometry2, material2);
          leftPlane.position.y = 1000;
          leftPlane.position.z = 500;
          leftPlane.position.x = -5950;
          leftPlane.rotation.y = Math.PI/2;

          const rightPlane = new THREE.Mesh(geometry2, material2);
          rightPlane.position.y = 1000;
          rightPlane.position.z = 500;
          rightPlane.position.x = 5000;
          rightPlane.rotation.y = Math.PI/2;

          this.scene.add(frontPlane);
          this.scene.add(backPlane);
          this.scene.add(leftPlane);
          this.scene.add(rightPlane);




    }
} export { ScenarioModelsController };
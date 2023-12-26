import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class MyCar {
    constructor() {
        this.carWheels = new THREE.Group();
        this.car = new THREE.Group();

        this.build();
    }    

    build() {
        const loader = new GLTFLoader().setPath('models/');
		loader.load('cloud.glb', async (gltf) => {
			const model = gltf.scene;
			model.traverse(function (object){
				if (object.isMesh) object.castShadow = true;
			});
			model.position.set(20, 12, 0);
			model.scale.set(20.0, 20.0, 20.0);
			this.car.add(model);
		});


		loader.load('carCloud.glb', async (gltf) => {
			const model = gltf.scene;
			model.traverse(function (object){
				if (object.isMesh) object.castShadow = true;
			}
			);
			model.position.set(20, 6, 0);
			model.scale.set(40.0, 40.0, 40.0);
			let bottomRightWheel = model.getObjectByName('bottomRightWheel');
			let bottomLeftWheel = model.getObjectByName('bottomLeftWheel');
			let topRightWheel = model.getObjectByName('topRightWheel');
			let topLeftWheel = model.getObjectByName('topLeftWheel');
			this.carWheels.add(bottomRightWheel);
			this.carWheels.add(bottomLeftWheel);
			this.carWheels.add(topRightWheel);
			this.carWheels.add(topLeftWheel);
			this.carWheels.scale.set(0.04, 0.04, 0.04);
			this.carWheels.position.set(20, 6, 0);
			this.car.add(this.carWheels);
			this.car.add(model);
			const pointLightBack = new THREE.PointLight(0xffffff, 900, 20);
			pointLightBack.position.set(this.carWheels.position.x, this.carWheels.position.y + 10, this.carWheels.position.z-5);
			this.car.add(pointLightBack);
			const pointLightFront = new THREE.PointLight(0xffffff, 900, 20);
			pointLightFront.position.set(this.carWheels.position.x, this.carWheels.position.y + 10, this.carWheels.position.z+15);
			this.car.add(pointLightFront);
			//go throught the group and cast and receive shadow
			this.car.traverse(function (object){
				if (object.isMesh) object.castShadow = true;
				if (object.isMesh) object.receiveShadow = true;
			});
		});
    }
}

export { MyCar };
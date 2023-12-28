import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class MyCar {
    constructor(character) {
        this.carWheels = new THREE.Group();
        this.car = new THREE.Group();
        this.characterModel = null;
        this.carModel = null;
        this.radius = 15;
        this.modelRendered = false;
        this.getModels(character);
        this.build();
    }

    build() {
        const loader = new GLTFLoader().setPath('models/');

		loader.load(this.characterModel, async (gltf) => {
			const model = gltf.scene;
			model.traverse(function (object){
				if (object.isMesh) object.castShadow = true;
			});
			model.position.set(0, 12, 0);
			model.scale.set(20.0, 20.0, 20.0);
			this.car.add(model);
		});


		loader.load(this.carModel, async (gltf) => {
			const model = gltf.scene;
			model.traverse(function (object){
				if (object.isMesh) object.castShadow = true;
			}
			);
			model.position.set(0, 6, 0);
			model.scale.set(40.0, 40.0, 40.0);
			let bottomRightWheel = model.getObjectByName('bottomRightWheel');
			let bottomLeftWheel = model.getObjectByName('bottomLeftWheel');
			let topRightWheel = model.getObjectByName('topRightWheel');
			let topLeftWheel = model.getObjectByName('topLeftWheel');
			this.carWheels.add(bottomRightWheel);
			this.carWheels.add(bottomLeftWheel);
			this.carWheels.add(topRightWheel);
			this.carWheels.add(topLeftWheel);
			this.carWheels.position.set(0, 6, 0);
			this.carWheels.scale.set(0.04, 0.04, 0.04);
            //console.log("carWheels", this.carWheels.children);
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

    getModels(character) {
        switch (character) {
            case "cloud":
                this.characterModel = "cloud.glb"
                this.carModel = "carCloud.glb"
                break;
            default:
                this.characterModel = "cloud.glb"
                this.carModel = "carCloud.glb"
                break;
        }
    }

    getChassisCenter(){
        if (this.carWheels.children.length != 4) return new THREE.Vector3();

        let topLeft = this.carWheels.getObjectByName('topLeftWheel');
		let topRight = this.carWheels.getObjectByName('topRightWheel');
		let bottomLeft = this.carWheels.getObjectByName('bottomLeftWheel');
		let bottomRight = this.carWheels.getObjectByName('bottomRightWheel');


		// get the center of the front wheels
		let centerFront = new THREE.Vector3();
		centerFront.addVectors(topLeft.getWorldPosition(new THREE.Vector3), topRight.getWorldPosition(new THREE.Vector3));
		centerFront.divideScalar(2);

		// get the center of the back wheels
		let centerBack = new THREE.Vector3();
		centerBack.addVectors(bottomLeft.getWorldPosition(new THREE.Vector3), bottomRight.getWorldPosition(new THREE.Vector3));
		centerBack.divideScalar(2);

		// get the center of the car
		let center = new THREE.Vector3();
		center.addVectors(centerFront, centerBack);
		center.divideScalar(2);

		return center;
	}
}

export { MyCar };
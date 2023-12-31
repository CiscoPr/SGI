import * as THREE from 'three';
import { PickingController } from './PickingController.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class CarSelector {
    constructor(app) {
        this.app = app;

        this.carSelectorDone = false;
        this.carModels = [];

        //initial car positions
        this.initialCarPosX = -8200;
        this.initialCarPosY = 70;
        this.initialCarPosZ = -1050;

        //initial character positions
        this.initialCharPosX = -8200;
        this.initialCharPosY = 62.5;
        this.initialCharPosZ = -1050;

        this.raycaster = new THREE.Raycaster();
        this.raycaster.near = 1;
        this.raycaster.far = 700;

        this.pointer = new THREE.Vector2();
        this.intersectedObj = null;
        this.pickingColor = "0xCFE6FF";

        this.availableLayers = ['none', 1, 2, 3]
        this.selectedLayer = this.availableLayers[0]

        this.notPickableObjIds = []
        this.carWithCharacter = null;
        this.pickingController = new PickingController(this.app, this.raycaster, this.pointer, this.intersectedObj, this.pickingColor, this.availableLayers, this.selectedLayer, this.notPickableObjIds);

        this.build();

        this.mousePressed = false;



        window.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        window.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    }

    handleMouseDown(event) {
        //of the screen is the origin
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        switch (event.button) {
            case 0:
                this.mousePressed = true;
                //console.log("Position x: " + this.pointer.x + " y: " + this.pointer.y);
                // if the mouse clicks on the start game button
                break;
        }
    }

    handleMouseUp(event) {
        switch (event.button) {
            case 0:
                this.mousePressed = false;
                break;
        }
    }

    build() {
        //traverse models/cars/ folder and copy all the name of the files to the array
        //then we can load them
        //add a plan
        const planeGeometryCloud = new THREE.PlaneGeometry(250, 365);
        const planeMaterialCloud = new THREE.MeshBasicMaterial({color: 0xffffff});
        planeMaterialCloud.transparent = true;
        planeMaterialCloud.opacity = 0.5;

        const planeCloud = new THREE.Mesh(planeGeometryCloud, planeMaterialCloud);
        planeCloud.position.set(this.initialCarPosX+60, this.initialCarPosY + 75, this.initialCarPosZ + 75);
        planeCloud.rotation.x = -Math.PI / 2;
        this.app.scene.add(planeCloud);
        this.loadCharacterModel("cloudPose.glb")
        this.loadCarModel("carCloud.glb")

        //add a plan
        const planeGeometryTifa = new THREE.PlaneGeometry(250, 365);
        const planeMaterialTifa = new THREE.MeshBasicMaterial({color: 0xffffff});
        planeMaterialTifa.transparent = true;
        planeMaterialTifa.opacity = 0.5;

        const planeTifa = new THREE.Mesh(planeGeometryTifa, planeMaterialTifa);
        planeTifa.position.set(this.initialCarPosX+ 430, this.initialCarPosY + 75, this.initialCarPosZ + 75);
        planeTifa.rotation.x = -Math.PI / 2;
        this.app.scene.add(planeTifa);
        this.loadCharacterModel("tifaPose.glb")
        this.loadCarModel("carTifa.glb")




    }

    loadPlane() {

    }

    loadCharacterModel(characterModelFile) {
        const loader = new GLTFLoader().setPath('models/characters/');
        loader.load(characterModelFile, async (gltf) => {
            const model = gltf.scene;
            model.traverse(function (object) {
                if (object.isMesh) object.castShadow = true;
            });

            model.name = characterModelFile;
            const carWithCharacter = new THREE.Group();
            carWithCharacter.add(model);
            carWithCharacter.rotation.y = Math.PI;
            carWithCharacter.position.set(this.initialCharPosX, this.initialCharPosY, this.initialCharPosZ);
            carWithCharacter.scale.set(250.0, 250.0, 250.0);

            this.app.scene.add(carWithCharacter);
            this.initialCharPosX += 425;
        });
    }

    loadCarModel(carModelFile){
        const loader = new GLTFLoader().setPath('models/cars/');
        loader.load(carModelFile, async (gltf) => {
            const model = gltf.scene;
            model.traverse(function (object) {
                if (object.isMesh) object.castShadow = true;
            });

            model.name = carModelFile;
            const carWithCharacter = new THREE.Group();
            carWithCharacter.add(model);
            carWithCharacter.position.set(this.initialCarPosX, this.initialCarPosY, this.initialCarPosZ);
            carWithCharacter.scale.set(400.0, 400.0, 400.0);

            this.app.scene.add(carWithCharacter);
            this.initialCarPosX += 425;
        });

    }

    update() {
    }
}
export {CarSelector};
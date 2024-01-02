import * as THREE from 'three';
import { PickingController } from './PickingController.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class CarSelector {
    constructor(app) {
        this.app = app;

        this.carSelectorDone = false;
        this.carModels = [];
        this.charsModels = [];
        this.planes = [];
        this.selectedCharacter = "";
        this.selectedMaxSpeed = 0;
        this.selectedAcceleration = 0;
        this.selectedBrakeSpeed = 0;

        this.infoCard = null;

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
        this.raycaster.far = 1000;

        this.pointer = new THREE.Vector2();
        this.intersectedObj = null;
        this.pickingColor = "0xfff000";

        this.availableLayers = ['none', 1, 2, 3, 4]
        this.selectedLayer = this.availableLayers[0]

        this.notPickableObjIds = ["parking3", "terrain", "cloud", "tifa"]
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
                console.log("Position x: " + this.pointer.x + " y: " + this.pointer.y);
                // if the mouse clicks on the start game button
                if (this.pointer.x > -0.64 && this.pointer.x < -0.34 && this.pointer.y > -0.94 && this.pointer.y < -0.1) {
                    if(this.infoCard != null) this.app.scene.remove(this.infoCard);
                    console.log("Cloud selected");
                    this.buildCharacterInfoCard("cloud");
                    //this.carSelectorDone = true;
                }
                else if (this.pointer.x > -0.17 && this.pointer.x < 0.12 && this.pointer.y > -0.94 && this.pointer.y < -0.1) {
                    if(this.infoCard != null) this.app.scene.remove(this.infoCard);
                    this.buildCharacterInfoCard("tifa");
                    console.log("Tifa selected");
                    //this.carSelectorDone = true;
                }

                else if(this.pointer.x > 0.55 && this.pointer.x < 0.71 && this.pointer.y > -0.38 && this.pointer.y < -0.31){
                    if(this.infoCard != null){
                        this.selectedCharacter = this.infoCard.name.toString();
                        console.log("name: " + this.selectedCharacter);
                        this.carSelectorDone = true;
                    }
                }

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

    buildCharacterInfoCard(character){

        if(character == "cloud"){
            this.selectedMaxSpeed = 10;
            this.selectedAcceleration = 0.5;
            this.selectedBrakeSpeed = 1.0;
        } else if(character == "tifa"){
            this.selectedMaxSpeed = 15;
            this.selectedAcceleration = 0.3;
            this.selectedBrakeSpeed = 1.5;
        }

        //add a plan for picking
        const planeGeometry = new THREE.PlaneGeometry(400, 600);
        const planeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
        planeMaterial.transparent = true;

        // add texture
        const loader = new THREE.TextureLoader();
        const texture = loader.load('./scene/textures/elements/'+character+'InfoCard.png');
        planeMaterial.map = texture;

        const planeChar = new THREE.Mesh(planeGeometry, planeMaterial);

        planeChar.name = character;
        planeChar.layers.enable(3);

        this.infoCard = new THREE.Group();
        this.infoCard.add(planeChar);

        //this.infoCard.add(planeSelect);
        this.infoCard.position.set(this.initialCarPosX + 180, this.initialCarPosY + 80, this.initialCarPosZ - 150);
        this.infoCard.rotation.x = -Math.PI / 2;
        this.infoCard.name = character;
        this.infoCard.layers.enable(3);
        this.planes.push(this.infoCard);
        this.app.scene.add(this.infoCard);
    }

    build() {
        //add a plan for picking
        const planeGeometryCloud = new THREE.CircleGeometry(200, 32);
        const planeMaterialCloud = new THREE.MeshBasicMaterial({color: 0xffffff});
        planeMaterialCloud.transparent = true;
        planeMaterialCloud.opacity = 0.35;

        const planeCloud = new THREE.Mesh(planeGeometryCloud, planeMaterialCloud);
        planeCloud.position.set(this.initialCarPosX+60, this.initialCarPosY + 75, this.initialCarPosZ + 75);
        planeCloud.rotation.x = -Math.PI / 2;
        this.planes.push(planeCloud);
        this.app.scene.add(planeCloud);
        this.loadCharacterModel("cloudPose.glb")
        this.loadCarModel("carCloud.glb")

        //add a plan
        const planeGeometryTifa = new THREE.CircleGeometry(200, 32);
        const planeMaterialTifa = new THREE.MeshBasicMaterial({color: 0xffffff});
        planeMaterialTifa.transparent = true;
        planeMaterialTifa.opacity = 0.35;

        const planeTifa = new THREE.Mesh(planeGeometryTifa, planeMaterialTifa);
        planeTifa.position.set(this.initialCarPosX+ 430, this.initialCarPosY + 75, this.initialCarPosZ + 75);
        planeTifa.rotation.x = -Math.PI / 2;
        this.planes.push(planeTifa);
        this.app.scene.add(planeTifa);
        this.loadCharacterModel("tifaPose.glb")
        this.loadCarModel("carTifa.glb")




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
            this.charsModels.push(carWithCharacter);
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
            this.carModels.push(carWithCharacter);
            this.app.scene.add(carWithCharacter);
            this.initialCarPosX += 425;
        });

    }

    getSelectedCharacter() {
        return this.selectedCharacter;
    }

    getSelectedMaxSpeed(){
        return this.selectedMaxSpeed;
    }

    getSelectedAcceleration(){
        return this.selectedAcceleration;
    }

    getSelectedBrakeSpeed(){
        return this.selectedBrakeSpeed;
    }

    update() {

        if (this.carSelectorDone) {
            for(let i = 0; i < this.carModels.length; i++){
                this.app.scene.remove(this.carModels[i]);
                this.app.scene.remove(this.charsModels[i]);
                this.app.scene.remove(this.planes[i]);
                if(this.infoCard != null) this.app.scene.remove(this.infoCard);
                this.raycaster.near = 0;
                this.raycaster.far = 0;
            }
        }
    }
}
export {CarSelector};
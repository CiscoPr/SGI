import * as THREE from 'three';
import { PickingController } from './PickingController.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class EnemySelector {
        constructor(app) {
        this.app = app;

        this.enemySelectorDone = false;
        this.carModels = [];
        this.charsModels = [];
        this.planes = [];
        this.selectedCharacter = "";
        this.infoCard = null;

        this.acceleration = 0;
        this.dificculty = 1;

        //initial car positions
        this.initialCarPosX = -8200;
        this.initialCarPosY = 70;
        this.initialCarPosZ = 150;

        //initial character positions
        this.initialCharPosX = -8200;
        this.initialCharPosY = 62.5;
        this.initialCharPosZ = 150;

        this.raycaster = new THREE.Raycaster();
        this.raycaster.near = 1;
        this.raycaster.far = 1000;

        this.pointer = new THREE.Vector2();
        this.intersectedObj = null;
        this.pickingColor = "0xfc2020";

        this.availableLayers = ['none', 1, 2, 3, 4]
        this.selectedLayer = this.availableLayers[0]

        this.notPickableObjIds = ["parking2", "terrain", "cloud", "tifa"]
        this.carWithCharacter = null;
        this.pickingController = new PickingController(this.app, this.raycaster, this.pointer, this.intersectedObj, this.pickingColor, this.availableLayers, this.selectedLayer, this.notPickableObjIds);

        this.build();

        this.mousePressed = false;

        //flag to check if the escape key has been pressed
        this.escapePressed = false;

        window.addEventListener('keydown', (e) => this.handleKeyDown(e));

        document.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    }

    handleKeyDown(event) {
        switch (event.key) {
            case 'Escape':
                this.escapePressed = true;
                break;
        }
    }

    handleMouseDown(event) {
        //of the screen is the origin
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        if(this.enemySelectorDone || this.escapePressed) return;
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

                else if(this.pointer.x > 0.42 && this.pointer.x < 0.66 && this.pointer.y > -0.17 && this.pointer.y < -0.09){
                    if(this.infoCard != null){
                        this.selectedCharacter = this.infoCard.name.toString();
                        if(this.selectedCharacter == "cloud") this.acceleration = 0.5;
                        else if(this.selectedCharacter == "tifa") this.acceleration = 0.3;
                        this.dificculty = 1;
                        console.log("name: " + this.selectedCharacter);
                        this.enemySelectorDone = true;
                    }
                }

                else if(this.pointer.x > 0.42 && this.pointer.x < 0.66 && this.pointer.y > -0.40 && this.pointer.y < -0.29){
                    if(this.infoCard != null){
                        this.selectedCharacter = this.infoCard.name.toString();
                        if(this.selectedCharacter == "cloud") this.acceleration = 1.0;
                        else if(this.selectedCharacter == "tifa") this.acceleration = 0.8;
                        this.dificculty = 2;
                        console.log("name: " + this.selectedCharacter);
                        this.enemySelectorDone = true;
                    }
                }

                else if(this.pointer.x > 0.42 && this.pointer.x < 0.66 && this.pointer.y > -0.63 && this.pointer.y < -0.52){
                    if(this.infoCard != null){
                        this.selectedCharacter = this.infoCard.name.toString();
                        if(this.selectedCharacter == "cloud") this.acceleration = 1.5;
                        else if(this.selectedCharacter == "tifa") this.acceleration = 1.3;
                        this.dificculty = 3;
                        console.log("name: " + this.selectedCharacter);
                        this.enemySelectorDone = true;
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
        //add a plan for picking
        const planeGeometry = new THREE.PlaneGeometry(400, 600);
        const planeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
        planeMaterial.transparent = true;

        // add texture
        const loader = new THREE.TextureLoader();
        const texture = loader.load('./scene/textures/elements/'+character+'EnemyInfoCard.png');
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

    getDifficulty(){
        return this.dificculty;
    }

    getAcceleration(){
        return this.acceleration;
    }

    getEscapePressed(){
        return this.escapePressed;
    }

    update() {
        //TODO: make the user be able to select the level of dificulty
        //      of the enemy

        if (this.enemySelectorDone || this.escapePressed) {
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
export { EnemySelector };
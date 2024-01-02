import * as THREE from 'three';
import { PickingController } from './PickingController.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MyObstacle } from '../components/MyObstacle.js';

class ObstacleSelector{
    constructor(app) {
        this.app = app;

        this.obsSelectorDone = false;
        this.obstacleModels = [];
        this.planes = [];
        this.selectedCharacter = "";

        // TODO: we probably will need to add flags to change in between
        // obstacle selection and its position in the track

        //initial Obs positions
        this.initialObsPosX = -8200;
        this.initialObsPosY = 70;
        this.initialObsPosZ = 1350;
        this.ob1 = new MyObstacle('speed', new THREE.Vector3(this.initialObsPosX, this.initialObsPosY, this.initialObsPosZ), this.app.scene);
        this.ob2 = new MyObstacle('time', new THREE.Vector3(this.initialObsPosX + 425, this.initialObsPosY, this.initialObsPosZ), this.app.scene);

        this.raycaster = new THREE.Raycaster();
        this.raycaster.near = 1;
        this.raycaster.far = 1000;

        this.pointer = new THREE.Vector2();
        this.intersectedObj = null;
        this.pickingColor = "0x6afc6f";

        this.availableLayers = ['none', 1, 2]
        this.selectedLayer = this.availableLayers[0]

        this.notPickableObjIds = ["parking1", "terrain"]
        this.pickingController = new PickingController(this.app, this.raycaster, this.pointer, this.intersectedObj, this.pickingColor, this.availableLayers, this.selectedLayer, this.notPickableObjIds);

        this.build();

        this.mousePressed = false;

        //flag to check if the escape key has been pressed
        this.escapePressed = false;

        window.addEventListener('keydown', (e) => this.handleKeyDown(e));

        window.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        window.addEventListener('mouseup', (e) => this.handleMouseUp(e));
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
        if(this.obsSelectorDone || this.escapePressed) return;
        switch (event.button) {
            case 0:
                this.mousePressed = true;
                console.log("Position x: " + this.pointer.x + " y: " + this.pointer.y);
                // if the mouse clicks on the start game button
                if (this.pointer.x > -0.64 && this.pointer.x < -0.34 && this.pointer.y > -0.94 && this.pointer.y < -0.1) {
                    console.log("Ob1 selected");
                    this.obsSelectorDone = true;
                }
                else if (this.pointer.x > -0.17 && this.pointer.x < 0.12 && this.pointer.y > -0.94 && this.pointer.y < -0.1) {
                    console.log("Ob2 selected");
                    this.obsSelectorDone = true;
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

    build() {
        //add a plan for picking
        const planeGeometryOb1 = new THREE.CircleGeometry(200, 32);
        const planeMaterialOb1 = new THREE.MeshBasicMaterial({ color: 0xffffff });
        planeMaterialOb1.transparent = true;
        planeMaterialOb1.opacity = 0.35;

        const planeOb1 = new THREE.Mesh(planeGeometryOb1, planeMaterialOb1);
        planeOb1.position.set(this.initialObsPosX + 60, this.initialObsPosY + 75, this.initialObsPosZ + 75);
        planeOb1.rotation.x = -Math.PI / 2;
        this.planes.push(planeOb1);
        this.app.scene.add(planeOb1);



        //add a plan
        const planeGeometryOb2 = new THREE.CircleGeometry(200, 32);
        const planeMaterialOb2 = new THREE.MeshBasicMaterial({ color: 0xffffff });
        planeMaterialOb2.transparent = true;
        planeMaterialOb2.opacity = 0.35;

        const planeOb2 = new THREE.Mesh(planeGeometryOb2, planeMaterialOb2);
        planeOb2.position.set(this.initialObsPosX + 430, this.initialObsPosY + 75, this.initialObsPosZ + 75);
        planeOb2.rotation.x = -Math.PI / 2;
        this.planes.push(planeOb2);
        this.app.scene.add(planeOb2);

    }

    getEscapePressed(){
        return this.escapePressed;
    }

    update() {
        // TODO: alter between changing from obstacle selection to obstacle position
        // in the track

        if (this.obsSelectorDone || this.escapePressed) {
            this.app.scene.remove(this.planes[0]);
            this.app.scene.remove(this.planes[1]);

            this.raycaster.near = 0;
            this.raycaster.far = 0;
        }
    }



} export { ObstacleSelector };
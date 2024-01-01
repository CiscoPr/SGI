import * as THREE from 'three';
import { PickingController } from './PickingController.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class ObstacleSelector{
    constructor(app) {
        this.app = app;

        this.carSelectorDone = false;
        this.obstacleModels = [];
        this.planes = [];
        this.selectedCharacter = "";

        //initial car positions
        this.initialObsPosX = -8200;
        this.initialObsPosY = 70;
        this.initialObsPosZ = -1050;


        this.raycaster = new THREE.Raycaster();
        this.raycaster.near = 1;
        this.raycaster.far = 700;

        this.pointer = new THREE.Vector2();
        this.intersectedObj = null;
        this.pickingColor = "0xfff000";

        this.availableLayers = ['none', 1, 2]
        this.selectedLayer = this.availableLayers[0]

        this.notPickableObjIds = ["parking1", "terrain"]
        this.carWithCharacter = null;
        this.pickingController = new PickingController(this.app, this.raycaster, this.pointer, this.intersectedObj, this.pickingColor, this.availableLayers, this.selectedLayer, this.notPickableObjIds);

        this.build();

        this.mousePressed = false;



        window.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        window.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    }

} export { ObstacleSelector };
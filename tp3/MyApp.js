
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MyContents } from './MyContents.js';
import { MyGuiInterface } from './MyGuiInterface.js';
import Stats from 'three/addons/libs/stats.module.js'

/**
 * This class contains the application object
 */
class MyApp  {
    /**
     * the constructor
     */
    constructor() {
        this.scene = null
        this.stats = null

        // camera related attributes
        this.activeCamera = null
        this.activeCameraName = null
        this.lastCameraName = null
        this.cameras = []
        this.frustumSize = 20

        // other attributes
        this.renderer = null
        this.controls = null
        this.gui = null
        this.axis = null
        this.contents == null

    }
    /**
     * initializes the application
     */
    init() {

        // Create an empty scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x101010 );

        this.stats = new Stats()
        this.stats.showPanel(1) // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom)

        this.initCameras();
        this.setActiveCamera('Perspective')

        // Create a renderer with Antialiasing
        this.renderer = new THREE.WebGLRenderer({antialias:true});
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setClearColor("#000000");
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type =
                THREE.PCFSoftShadowMap; // search for other alternatives

        // Configure renderer size
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        // Append Renderer to DOM
        document.getElementById("canvas").appendChild( this.renderer.domElement );

        // manage window resizes
        window.addEventListener('resize', this.onResize.bind(this), false );
    }

    /**
     * initializes all the cameras
     */
    initCameras() {
        const aspect = window.innerWidth / window.innerHeight;

        // Create a basic perspective camera
        const perspective1 = new THREE.PerspectiveCamera( 75, aspect, 0.1, 50000 )
        perspective1.position.set(4100, 100, 3200)
        this.cameras['Perspective'] = perspective1

        // defines the frustum size for the orthographic cameras
        const left = -this.frustumSize / 2 * aspect
        const right = this.frustumSize /2 * aspect
        const top = this.frustumSize / 2
        const bottom = -this.frustumSize / 2
        const near = -this.frustumSize /2
        const far =  this.frustumSize

        // create a left view orthographic camera
        const orthoLeft = new THREE.OrthographicCamera( left, right, top, bottom, near, far);
        orthoLeft.up = new THREE.Vector3(0,1,0);
        orthoLeft.position.set(-this.frustumSize /4,0,0)
        orthoLeft.lookAt( new THREE.Vector3(0,0,0) );
        this.cameras['Left'] = orthoLeft

        // create a top view orthographic camera
        const orthoTop = new THREE.OrthographicCamera( left, right, top, bottom, near, far);
        orthoTop.up = new THREE.Vector3(0,0,1);
        orthoTop.position.set(0, this.frustumSize /4, 0)
        orthoTop.lookAt( new THREE.Vector3(0,0,0) );
        this.cameras['Top'] = orthoTop

        // create a front view orthographic camera
        const orthoFront = new THREE.OrthographicCamera( left, right, top, bottom, near, far);
        orthoFront.up = new THREE.Vector3(0,1,0);
        orthoFront.position.set(0,0, this.frustumSize /4)
        orthoFront.lookAt( new THREE.Vector3(0,0,0) );
        this.cameras['Front'] = orthoFront

        // create a back view orthographic camera
        const orthoBack = new THREE.OrthographicCamera( left, right, top, bottom, near, far);
        orthoBack.up = new THREE.Vector3(0,1,0);
        orthoBack.position.set(0,0, -this.frustumSize /4)
        orthoBack.lookAt( new THREE.Vector3(0,0,0) );
        this.cameras['Back'] = orthoBack

        // create a right view orthographic camera
        const orthoRight = new THREE.OrthographicCamera( left, right, top, bottom, near, far);
        orthoRight.up = new THREE.Vector3(0,1,0);
        orthoRight.position.set(this.frustumSize /4,0,0)
        orthoRight.lookAt( new THREE.Vector3(0,0,0) );
        this.cameras['Right'] = orthoRight
    }

    /**
     * sets the active camera by name
     * @param {String} cameraName
     */
    setActiveCamera(cameraName) {
        this.activeCameraName = cameraName
        this.activeCamera = this.cameras[this.activeCameraName]


        console.log("activeCameraName: ", this.activeCamera)
    }

    /**
     * updates the active camera if required
     * this function is called in the render loop
     * when the active camera name changes
     * it updates the active camera and the controls
     */
    updateCameraIfRequired() {

        // camera changed?
        if (this.lastCameraName !== this.activeCameraName) {
            this.lastCameraName = this.activeCameraName;
            this.activeCamera = this.cameras[this.activeCameraName]
            document.getElementById("camera").innerHTML = this.activeCameraName
            // call on resize to update the camera aspect ratio
            // among other things
            this.onResize()

            // are the controls yet?
            if (this.controls === null) {
                // Orbit controls allow the camera to orbit around a target.
                this.controls = new OrbitControls( this.activeCamera, this.renderer.domElement );
                this.controls.enableZoom = true;
                this.controls.update();
            }
            else {
                this.controls.object = this.activeCamera
            }
        }
        

        //spinning camera in menu
        if(this.contents && (!this.contents.mainController.mainMenuFlag) || (!this.contents.mainController.inputMenuFlag)){
            this.activeCamera.position.x = 1000 * Math.cos(0.0001 * Date.now());
            this.activeCamera.position.z = 1000 * Math.sin(0.0001 * Date.now());
            this.activeCamera.position.y = 800;

            this.activeCamera.lookAt(0, 800, 0);
        }

        //camera for car selection a
        else if(this.contents && (!this.contents.mainController.carSelectorFlag)){
            this.activeCamera.position.x = -7750
            this.activeCamera.position.y = 700;
            this.activeCamera.position.z = -1200

            this.activeCamera.lookAt(-7750, 0, -1200);
        }

        //camera for enemy selection
        else if (this.contents && (!this.contents.mainController.enemySelectorFlag)) {
            this.activeCamera.position.x = -7750
            this.activeCamera.position.y = 700;
            this.activeCamera.position.z = 0

            this.activeCamera.lookAt(-7750, 0, 0);
        }

        else if(this.contents && (this.contents.mainController.phaseCounter == 5) && this.contents.mainController.game.playerCar.car != null){
            const car = this.contents.mainController.game.playerCar.car;
            const carPosition = car.position;
            let offset = new THREE.Vector3(0, 15, -50);

            // Rotate the offset by the car's rotation
            offset.applyQuaternion(car.quaternion);
            const cameraPosition = carPosition.clone().add(offset);
            this.activeCamera.position.lerp(cameraPosition, 1.0); // Smoothly move the camera
            let lookAtOffset = new THREE.Vector3(0, 0, 25);
            lookAtOffset.applyQuaternion(car.quaternion);
            const lookAtPosition = carPosition.clone().add(lookAtOffset);
            this.controls.target.lerp(lookAtPosition, 0.5); // Smoothly move the target
            this.controls.update();
        }

        
        //camera for obstacle selection
        else if (this.contents && (!this.contents.mainController.obstacleSelectorFlag) && this.contents.mainController.phaseCounter == 7) {
            this.activeCamera.position.x = -7750
            this.activeCamera.position.y = 700;
            this.activeCamera.position.z = 1200

            this.activeCamera.lookAt(-7750, 0, 1200);
        }

        //camera for obstacle placement
        else if (this.contents && (!this.contents.mainController.obstaclePlacerFlag) && this.contents.mainController.phaseCounter == 9) {
            this.activeCamera.position.x = -0.0003851978972425393
            this.activeCamera.position.y = 11819.149104025764;
            this.activeCamera.position.z = 0

            this.activeCamera.lookAt(0, 0, 0);
        }

        else if (this.contents && (this.contents.mainController.phaseCounter == 11)) {
            this.activeCamera.position.x = 4000;
            this.activeCamera.position.y = 34;
            this.activeCamera.position.z = 500;

            this.activeCamera.lookAt(4000, 150, 0);
        }

        console.log("activeCameraName: ", this.activeCamera.position.y)
/*
        // Update the camera position to follow the car
        if (this.contents && this.contents.carController && (this.contents.gameMenu == null)) {
            const car = this.contents.carController.model;
            const carPosition = car.position;
            let offset = new THREE.Vector3(0, 15, -50);

            // Rotate the offset by the car's rotation
            offset.applyQuaternion(car.quaternion);

            const cameraPosition = carPosition.clone().add(offset);
            this.activeCamera.position.lerp(cameraPosition, 1.0); // Smoothly move the camera

            // Make the camera look at the car
            let lookAtOffset = new THREE.Vector3(0, 0, 25);
            lookAtOffset.applyQuaternion(car.quaternion);
            const lookAtPosition = carPosition.clone().add(lookAtOffset);
            this.controls.target.lerp(lookAtPosition, 0.5); // Smoothly move the target
            this.controls.update();
        }
        
        


        /*
        if (this.contents && this.contents.automaticCarController && (this.contents.gameMenu == null)) {
            const car = this.contents.automaticCarController.model;
            const carPosition = car.position;
            let offset = new THREE.Vector3(0, 15, -50);

            // Rotate the offset by the car's rotation
            offset.applyQuaternion(car.quaternion);

            const cameraPosition = carPosition.clone().add(offset);
            this.activeCamera.position.lerp(cameraPosition, 1.0); // Smoothly move the camera

            // Make the camera look at the car
            let lookAtOffset = new THREE.Vector3(0, 0, 25);
            lookAtOffset.applyQuaternion(car.quaternion);
            const lookAtPosition = carPosition.clone().add(lookAtOffset);
            this.controls.target.lerp(lookAtPosition, 1.0); // Smoothly move the target
            this.controls.update();
        }
        */

    }

    /**
     * the window resize handler
     */
    onResize() {
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.activeCamera.aspect = window.innerWidth / window.innerHeight;
            this.activeCamera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
        }
    }
    /**
     *
     * @param {MyContents} contents the contents object
     */
    setContents(contents) {
        this.contents = contents;
    }

    /**
     * @param {MyGuiInterface} contents the gui interface object
     */
    setGui(gui) {
        this.gui = gui
    }

    /**
    * the main render function. Called in a requestAnimationFrame loop
    */
    render () {
        this.stats.begin()
        this.updateCameraIfRequired()

        // update the animation if contents were provided
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.contents.update()
        }


        // render the scene
        this.renderer.render(this.scene, this.activeCamera);

        // subsequent async calls to the render loop
        requestAnimationFrame( this.render.bind(this) );

        this.lastCameraName = this.activeCameraName
        this.stats.end()
    }


}


export { MyApp };
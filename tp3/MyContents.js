import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MyEngine } from './engine/MyEngine.js';
import { MyFileReader } from './parser/MyFileReader.js';
import {MyTrack} from './components/MyTrack.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { CarController } from './controller/CarController.js';

/**
 *  This class contains the contents of out application
 */
class MyContents {
  /**
       constructs the object
       @param {MyApp} app The application object
    */
  constructor(app) {
    this.app = app;
    this.axis = null;
    this.reader = new MyFileReader(app, this, this.onSceneLoaded);
		this.reader.open("scene/scene.xml")
    this.engine = new MyEngine(app, this);
    this.engine.init();

    // components
    this.track = null;

    this.bottomRightWheel = null;
    this.bottomLeftWheel = null;
    this.topRightWheel = null;
    this.topLeftWheel = null;
    this.carCloudWheels= new THREE.Group();
    this.carCloud = new THREE.Group();
    this.spotLight = null;
    this.carControls = new CarController(this.carCloud, this.app);
  }

  /**
   * initializes the contents
   */
  init() {
    // create once

    if (this.axis === null) {
      // create and attach the axis to the scene
      this.axis = new MyAxis(this);
      this.app.scene.add(this.axis);
    }

    //-------------------------------------------------------------------------------


    // add an ambient light
    const ambientLight = new THREE.AmbientLight(0x555555);
    this.app.scene.add(ambientLight);

    //--------------------------------------------------------------------------------

    const gridHelper = new THREE.GridHelper(100, 100);
    gridHelper.position.y = 0.5;
    this.app.scene.add(gridHelper);

    const loader = new GLTFLoader().setPath('models/');
    loader.load('cloud.glb', async (gltf) => {
      const model = gltf.scene;
      model.traverse(function (object){
        if (object.isMesh) object.castShadow = true;
      });
      model.position.set(20, 12, 0);
      model.scale.set(20.0, 20.0, 20.0);
      this.carCloud.add(model);
    });

    loader.load('tifa.glb', async (gltf) => {
      const model = gltf.scene;
      model.traverse(function (object){
        if (object.isMesh) object.castShadow = true;
      });
      model.position.set(5, 6, 0);
      model.scale.set(20.0, 20.0, 20.0);
      this.app.scene.add(gltf.scene);
    });

    loader.load('carCloud.glb', async (gltf) => {
      const model = gltf.scene;
      model.traverse(function (object){
        if (object.isMesh) object.castShadow = true;
      }
      );
      model.position.set(20, 6, 0);
      model.scale.set(40.0, 40.0, 40.0);
      this.bottomRightWheel = model.getObjectByName('bottomRightWheel');
      this.bottomLeftWheel = model.getObjectByName('bottomLeftWheel');
      this.topRightWheel = model.getObjectByName('topRightWheel');
      this.topLeftWheel = model.getObjectByName('topLeftWheel');
      this.carCloudWheels.add(this.bottomRightWheel);
      this.carCloudWheels.add(this.bottomLeftWheel);
      this.carCloudWheels.add(this.topRightWheel);
      this.carCloudWheels.add(this.topLeftWheel);
      this.carCloudWheels.scale.set(0.04, 0.04, 0.04);
      this.carCloudWheels.position.set(20, 6, 0);
      this.carCloud.add(this.carCloudWheels);
      this.carCloud.add(model);
      this.app.scene.add(this.carCloud);
    //--------------------------------------------------------------------------------


      // add a point light on the back of the model
      const pointLightBack = new THREE.PointLight(0xffffff, 900, 20);
      pointLightBack.position.set(this.carCloudWheels.position.x, this.carCloudWheels.position.y + 10, this.carCloudWheels.position.z-5);
      this.app.scene.add(pointLightBack);
      // add a point light helper for the previous point light
      const sphereSizeBack = 0.5;
      const pointLightBackHelper = new THREE.PointLightHelper(pointLightBack, sphereSizeBack);
      //this.app.scene.add(pointLightBackHelper);

      // add a point light on th front of the model
      const pointLightFront = new THREE.PointLight(0xffffff, 900, 20);
      pointLightFront.position.set(this.carCloudWheels.position.x, this.carCloudWheels.position.y + 10, this.carCloudWheels.position.z+15);
      this.app.scene.add(pointLightFront);
      // add a point light helper for the previous point light
      const sphereSizeFront = 0.5;
      const pointLightFrontHelper = new THREE.PointLightHelper(pointLightFront, sphereSizeFront);
      //this.app.scene.add(pointLightFrontHelper);

      //-------------------------------------------------------------------------------
    });



    //build components
    this.track = new MyTrack(this.app.scene);



  }



    readerError() {
        const hasError = this.reader.errorMessage != null ? true : false;
        return hasError;
    }

    /**
     * Called when the scene xml file load is complete
     * @param {MySceneData} data the entire scene data object
     */
    onSceneLoaded(data) {
        console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.");
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    output(obj, indent = 0) {
        console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""));
    }

    onAfterSceneLoadedAndBeforeRender(data) {

        // refer to descriptors in class MySceneData.js
        // to see the data structure for each item

        this.output(data.options)
        console.log("textures:")
        for (var key in data.textures) {
            let texture = data.textures[key]
            this.output(texture, 1)
        }

        console.log("materials:")
        for (var key in data.materials) {
            let material = data.materials[key]
            this.output(material, 1)
        }

        console.log("cameras:")
        for (var key in data.cameras) {
            let camera = data.cameras[key]
            this.output(camera, 1)
        }

        console.log("nodes:")
        for (var key in data.nodes) {
            let node = data.nodes[key]
            this.output(node, 1)
            for (let i=0; i< node.children.length; i++) {
                let child = node.children[i]
                if (child.type === "primitive") {
                    console.log("" + new Array(2 * 4).join(' ') + " - " + child.type + " with "  + child.representations.length + " " + child.subtype + " representation(s)")
                    if (child.subtype === "nurbs") {
                        console.log("" + new Array(3 * 4).join(' ') + " - " + child.representations[0].controlpoints.length + " control points")
                    }
                }
                else {
                    this.output(child, 2)
                }
            }
        }
    }


    controlKeys(model, app){
        const keysPressed = {};
        document.addEventListener('keydown', (e) => {
            console.log(e.key);
            keysPressed[e.key.toLowerCase()] = true;
            if(keysPressed['w']){
                this.carControls.setState('accelerate');
            }
            if(keysPressed['s']){
                this.carControls.setState('decelerate');
            }
        }, false);
        document.addEventListener('keyup', (e) => {
            console.log(e.key);
            keysPressed[e.key.toLowerCase()] = false;
        }, false);


    }



    update() {
      this.controlKeys(this.carCloud, this.app);
        const time = (Date.now() % 6000) / 6000;
        for (let i = 0; i < this.carCloudWheels.children.length; i++) {
          const wheel = this.carCloudWheels.children[i];
          wheel.center = new THREE.Vector3(0, 0, 0);
          wheel.rotation.x = time * Math.PI * 2;
        }
    }
}

export { MyContents };


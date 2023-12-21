import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MyEngine } from './engine/MyEngine.js';
import { MyFileReader } from './parser/MyFileReader.js';
import {MyTrack} from './components/MyTrack.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

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

    // add a point light on top of the model
    const pointLight = new THREE.PointLight(0xffffff, 500, 0);
    pointLight.position.set(0, 20, 0);
    this.app.scene.add(pointLight);
    // add a point light helper for the previous point light
    const sphereSize = 0.5;
    const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    this.app.scene.add(pointLightHelper);

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
      model.position.set(20, 12, 0);
      model.scale.set(20.0, 20.0, 20.0);
      this.app.scene.add(gltf.scene);
    });

    loader.load('tifa.glb', async (gltf) => {
      const model = gltf.scene;
      model.position.set(5, 6, 0);
      model.scale.set(20.0, 20.0, 20.0);
      this.app.scene.add(gltf.scene);
    });

    loader.load('carCloud.glb', async (gltf) => {
      const model = gltf.scene;
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

    update() {
        const time = (Date.now() % 6000) / 6000;
        for (let i = 0; i < this.carCloudWheels.children.length; i++) {
          const wheel = this.carCloudWheels.children[i];
          wheel.center = new THREE.Vector3(0, 0, 0);
          wheel.rotation.x = time * Math.PI * 2;
        }

    }
}

export { MyContents };


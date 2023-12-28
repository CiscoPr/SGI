import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MyEngine } from './engine/MyEngine.js';
import { MyFileReader } from './parser/MyFileReader.js';
import {MyTrack} from './components/MyTrack.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { CarController } from './controller/CarController.js';
import { AutomaticCarController } from './controller/AutomaticCarController.js';

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
    this.carController = new CarController(this.carCloud);
    this.automaticCarController = new AutomaticCarController(this.carCloud);
    this.keyPoints = [
      new THREE.Vector3(4000, 0, 0),
      new THREE.Vector3(4000, 0, 6000),
      new THREE.Vector3(-1500, 0, 6000),
      new THREE.Vector3(-4000, 0, 6000),
      new THREE.Vector3(-4000, 0, 2000),
      new THREE.Vector3(2000, 0, 2000),
      new THREE.Vector3(2000, 0, -1000),
      new THREE.Vector3(-5000, 0, -1000),
      new THREE.Vector3(-5000, 0, -5000),
      new THREE.Vector3(3000, 0, -5000),
      new THREE.Vector3(4000, 0, -3500),
      new THREE.Vector3(4000, 0, -2000),
      new THREE.Vector3(4000, 0, 0),
    ]
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

    //const gridHelper = new THREE.GridHelper(100, 100);
    //gridHelper.position.y = 0.5;
    //this.app.scene.add(gridHelper);

    const loader = new GLTFLoader().setPath('models/');
    loader.load('cloud.glb', async (gltf) => {
      const model = gltf.scene;
      model.traverse(function (object){
        if (object.isMesh) object.castShadow = true;
      });
      model.position.set(0, 12, 0);
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
      //this.app.scene.add(gltf.scene);
    });

    loader.load('carCloud.glb', async (gltf) => {
      const model = gltf.scene;
      model.traverse(function (object){
        if (object.isMesh) object.castShadow = true;
      }
      );
      model.position.set(0, 6, 0);
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
      this.carCloudWheels.position.set(0, 6, 0);
      this.carCloud.add(this.carCloudWheels);
      this.carCloud.add(model);
      const pointLightBack = new THREE.PointLight(0xffffff, 900, 20);
      pointLightBack.position.set(this.carCloudWheels.position.x, this.carCloudWheels.position.y + 10, this.carCloudWheels.position.z-5);
      this.carCloud.add(pointLightBack);
      const pointLightFront = new THREE.PointLight(0xffffff, 900, 20);
      pointLightFront.position.set(this.carCloudWheels.position.x, this.carCloudWheels.position.y + 10, this.carCloudWheels.position.z+15);
      this.carCloud.add(pointLightFront);
      this.carCloud.position.set(4100, 25, 0);
      //go throught the group and cast and receive shadow
      this.carCloud.traverse(function (object){
        if (object.isMesh) object.castShadow = true;
        if (object.isMesh) object.receiveShadow = true;
      });
      this.app.scene.add(this.carCloud);
      this.debugKeyFrames();
    });

    //build components
    this.track = new MyTrack(this.app.scene);


    loader.load('buildings.glb', async (gltf) => {
      const model = gltf.scene;
      model.traverse(function (object){
        if (object.isMesh) object.castShadow = true;
      });


      model.rotation.y = -Math.PI/2;
      model.position.set(6000, 350, -4500);
      model.scale.set(1500.0, 1500.0, 1500.0);
      this.app.scene.add(model);
      const model2 = gltf.scene.clone();
      model2.traverse(function (object){
        if (object.isMesh) object.castShadow = true;
      });
      model2.rotation.y = -Math.PI/2;
      model2.position.set(-6000, 350, -4500);
      model2.scale.set(1500.0, 1500.0, 1500.0);
      this.app.scene.add(model2);

    });

    loader.load('buildings2.glb', async (gltf) => {

      const model = gltf.scene;
      model.traverse(function (object){
        if (object.isMesh) object.castShadow = true;
      });
      model.position.set(-14000, 1360, -25000);
      model.scale.set(-70000.0, 70000.0, 70000.0);
      this.app.scene.add(model);
      const model2 = gltf.scene.clone();
      model2.traverse(function (object){
        if (object.isMesh) object.castShadow = true;
      });
      model2.position.set(14000, 1390, 25500);
      model2.scale.set(71000.0, 71000.0, -71000.0);
      this.app.scene.add(model2);

    });

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



    debugKeyFrames(){
        let spline = new THREE.CatmullRomCurve3([...this.keyPoints]);

        // Setup visual control points

        for (let i = 0; i < this.keyPoints.length; i++) {
            const geometry = new THREE.SphereGeometry(80, 32, 32)
            const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
            const sphere = new THREE.Mesh(geometry, material)
            sphere.position.set(... this.keyPoints[i])
            this.app.scene.add(sphere)
        }

        const tubeGeometry = new THREE.TubeGeometry(spline, 100, 50, 10, false)
        const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial)
        this.app.scene.add(tubeMesh);
    }


    update() {
      const [speed, turn] = this.carController.update();
      const time = (Date.now() % 6000) / 6000;
      const turnAngle = turn * Math.PI/2 ; // Adjust this value to get the desired turn angle

      const arrayPoints = this.track.path1.getSpacedPoints(10000);

      //console.log("arrayPoints", arrayPoints);
      let closestPointIndex = 0;
      let closestPointDistance = arrayPoints[0].distanceTo(this.carCloud.position);

      for(let i = 0; i < arrayPoints.length; i++){
        //get the closest point
        let currentDistance = arrayPoints[i].distanceTo(this.carCloud.position);
        if(currentDistance < closestPointDistance){
          closestPointIndex = i;
          closestPointDistance = currentDistance;
        }
      }

      console.log("closestPoint", closestPointDistance);

      if(closestPointDistance > 250){
       console.log("you're out of the track");
      }




      for (let i = 0; i < this.carCloudWheels.children.length; i++) {
          const wheel = this.carCloudWheels.children[i];
          wheel.center = new THREE.Vector3(0, 0, 0);
          //wheel.rotation.x = time * Math.PI * 5 * speed;
          console.log("my angle", turnAngle)
          // If the wheel is a front wheel, set its y rotation based on the turn direction
          if ((wheel.name === "topLeftWheel" || wheel.name === "topRightWheel")) {
            if(turnAngle !== 0){
              wheel.rotation.y = turnAngle;
            }
            else{
              wheel.rotation.y = 0;
              wheel.rotation.x = time * Math.PI * 5 * speed;
            }
          }else{
            wheel.rotation.x = time * Math.PI * 5 * speed;
          }
      }

    }
}

export { MyContents };


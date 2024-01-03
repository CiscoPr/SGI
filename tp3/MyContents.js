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
import { MyCar } from './components/MyCar.js'
import { CollisionController } from './controller/CollisionController.js';
import { MyObstacle } from './components/MyObstacle.js';
import { MyBoost } from './components/MyBoost.js';
import { ItemsController } from './controller/ItemsController.js';
import { LapController } from './controller/LapController.js';
import { MyHUD } from './components/MyHUD.js';
import { MyBillboard } from './components/MyBillboard.js';
import { MyTrafficLights } from './components/MyTrafficLights.js';

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
    this.modelsrendered = false;

    // gameflow control
    this.gameState = 0; // 0 - start, 1 - game, 2 - done, 3 - pause
    window.addEventListener('keyup', (e) => {
      if (e.keyCode == 32) {
        if (this.gameState == 1) {
          this.gameState = 3;
          console.log("paused");
        } else if (this.gameState == 3) {
          this.gameState = 1;
        }
      }
    });
    this.clock = null;

    // components
    this.track = null;
    this.playerCar = null;
    this.obstacles = [];
    this.boosts = [];
    this.hud = null;
    this.billboard = null;
    this.trafficLights = null;

    // helpers
    this.carSphere;

    // controllers
    this.carController = null;
    this.itemsController = null;
	  this.collisionSystem = null;
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

    // build components
    this.track = new MyTrack(this.app.scene);
    this.playerCar = new MyCar("cloud");
    this.boosts.push(new MyBoost("speed", new THREE.Vector3(4105, 45, 150), this.app.scene));
    this.boosts.push(new MyBoost("time", new THREE.Vector3(4040, 45, -150), this.app.scene));
    this.obstacles.push(new MyObstacle("speed", new THREE.Vector3(4089, 45, -150), this.app.scene));
    this.obstacles.push(new MyObstacle("time", new THREE.Vector3(4150, 45, 150), this.app.scene));

    // build helpers
    const geometry = new THREE.SphereGeometry(this.playerCar.radius);
	  const material = new THREE.MeshBasicMaterial({color: 0xffff00});
	  material.wireframe = true;
    this.carSphere = new THREE.Mesh(geometry, material);
	  this.app.scene.add(this.carSphere);

    // place dynamic components
    this.playerCar.car.position.set(4100, 25, 0);
    this.app.scene.add(this.playerCar.car);

    // start controllers
    this.carController = new CarController(this.playerCar.car, this.playerCar.carWheels, this.track);
    this.itemsController = new ItemsController(this.boosts, this.obstacles);
    this.collisionSystem = new CollisionController(this.carController, this.itemsController, this.playerCar, this.boosts, this.obstacles);
    this.lapController = new LapController(this.app, this.playerCar, this.track);
    //this.automaticCarController = new AutomaticCarController(this.app, this.playerCar.car, this.playerCar.carWheels, this.track);

    // create hud
    this.hud = new MyHUD(this.carController, this.lapController);
    this.hud.init(this.app.scene);
    
    // create billboard
    this.billboard = new MyBillboard(this.carController, this.lapController);
    this.billboard.init(this.app.scene);
    this.billboard.hud.scale.set(12, 12, 12);
    this.billboard.hud.rotation.y = -Math.PI / 2;
    this.billboard.hud.position.set(4400, 80, -500);


    // create traffic lights
    this.trafficLights = new MyTrafficLights();
    this.trafficLights.trafficLight.scale.set(12, 12, 12);
    this.trafficLights.trafficLight.position.set(4105, 80, 150);
    this.trafficLights.trafficLight.rotation.y = Math.PI;
    this.app.scene.add(this.trafficLights.trafficLight);

    const loader = new GLTFLoader().setPath('models/');

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

  updateStartGame() {
    if (this.trafficLights == null) return;
    this.trafficLights.update(this.app.scene);
    if (this.trafficLights.countdown < 0) { this.gameState = 1; }
  }

  updateGame() {
    if (this.collisionSystem != null ) this.collisionSystem.update();
    if (this.itemsController != null ) this.itemsController.update();
    if (this.hud != null) this.hud.update(this.app.activeCamera, (this.gameState == 3), false);
    if (this.trafficLights != null ) this.trafficLights.update(this.app.scene);
    if (this.billboard != null && this.carController != null && this.lapController != null ) this.billboard.update();
    
    /*
    if(this.automaticCarController != null){
      this.automaticCarController.update();
      this.lapController.update();
    }
    */

    if (this.carController != null ) {
      this.carController.update();
      this.lapController.update();
    }

    if (this.lapController != null && this.lapController.lap == 3) {
      if (this.clock == null) { this.clock = Date.now(); }
      if (Date.now() - this.clock > 5000) { this.gameState = 2; }
    }
  }

  pause() {
    if (this.hud != null) this.hud.update(this.app.activeCamera, (this.gameState == 3), true);
    this.carController.updateClock();
  }

  update() {
    if (this.gameState == 0) {
      this.updateStartGame();
    } else if (this.gameState == 1 ) {
      this.updateGame();
    } else if (this.gameState == 3) {
      this.pause();
    }

    if (this.carSphere != null ) {
      let chassisCenter = this.playerCar.getChassisCenter();
      let x = chassisCenter.x;
      let y = chassisCenter.y;
      let z = chassisCenter.z;
      this.carSphere.position.set(x, y, z);
      //console.log("spherePos", this.carSphere.position)
    }
  }
}

export { MyContents };

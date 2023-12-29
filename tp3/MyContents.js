import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MyEngine } from './engine/MyEngine.js';
import { MyFileReader } from './parser/MyFileReader.js';
import {MyTrack} from './components/MyTrack.js';;
import { CarController } from './controller/CarController.js';
import { AutomaticCarController } from './controller/AutomaticCarController.js';
import { MyCar } from './components/MyCar.js'
import { CollisionController } from './controller/CollisionController.js';
import { MyObstacle } from './components/MyObstacle.js';
import { MyBoost } from './components/MyBoost.js';
import { ItemsController } from './controller/ItemsController.js';
import { LapController } from './controller/LapController.js';
import { BuildingsController } from './controller/ScenarioModelsController.js';
import { Menu } from './controller/Menu.js';
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

    // components
    this.track = null;
    this.playerCar = null;
    this.gameMenu = null;
    this.obstacles = [];
    this.boosts = [];

    // helpers
    this.carSphere;

    // controllers
    this.carController = null;
    this.itemsController = null;
	  this.collisionSystem = null;
    this.buildings = null;
    this.counter = 0;


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
    this.buildings = new BuildingsController(this.app.scene);

    this.gameMenu = new Menu(this.app);



  }

  buildCar(){
    this.playerCar = new MyCar("cloud");
    // build helpers
    const geometry = new THREE.SphereGeometry(this.playerCar.radius);
    const material = new THREE.MeshBasicMaterial({color: 0xffff00});
    material.wireframe = true;
    this.carSphere = new THREE.Mesh(geometry, material);
    this.app.scene.add(this.carSphere);

    // place dynamic components
    this.playerCar.car.position.set(4100, 25, 0);
    this.app.scene.add(this.playerCar.car);
  }

  buildBoosts(){
    this.boosts.push(new MyBoost("speed", new THREE.Vector3(4105, 45, 150), this.app.scene));
    this.boosts.push(new MyBoost("time", new THREE.Vector3(4040, 45, -150), this.app.scene));
  }

  buildObstacles(){
    this.obstacles.push(new MyObstacle("speed", new THREE.Vector3(4089, 45, -150), this.app.scene));
    this.obstacles.push(new MyObstacle("time", new THREE.Vector3(4150, 45, 150), this.app.scene));
  }

  startControllers(){
      // start controllers
      this.carController = new CarController(this.playerCar.car, this.playerCar.carWheels, this.track);
      this.itemsController = new ItemsController(this.boosts, this.obstacles);
      this.collisionSystem = new CollisionController(this.carController, this.itemsController, this.playerCar, this.boosts, this.obstacles);

      //this.automaticCarController = new AutomaticCarController(this.app, this.playerCar.car, this.playerCar.carWheels, this.track);
      this.lapController = new LapController(this.app, this.playerCar, this.track);
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
	    if (this.collisionSystem != null ) this.collisionSystem.update();
      if (this.itemsController != null ) this.itemsController.update();

      /*
      if(this.automaticCarController != null){
        this.automaticCarController.update();
        this.lapController.update();
      }
      */

      if(this.gameMenu != null){
        this.gameMenu.update();
        if(this.gameMenu.done){
          this.counter++;
          this.gameMenu = null;
        }
      }

          //this will only execute once the player is out of the menu
      if(this.counter == 1){
        this.counter++;
        this.buildCar();
        this.buildBoosts();
        this.buildObstacles();
        this.startControllers();
      }
      console.log("this counter", this.counter)


      if (this.carController != null ){
        this.carController.update();
        this.lapController.update();
      }

      if (this.carSphere != null ){
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


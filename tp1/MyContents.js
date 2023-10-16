import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFloor } from './components/MyFloor.js';
import { MyWalls } from './components/MyWalls.js';
import { MyCake } from './components/MyCake.js';
import { MyCandle } from './components/MyCandle.js';
import { MyPlate } from './components/MyPlate.js';
import { MyTable } from './components/MyTable.js';
import { MyDoor } from './components/MyDoor.js'
import { MyPicture } from './components/MyPicture.js';
import { MyRug } from './components/MyRug.js';
import { MyClock } from './components/MyClock.js';
import { MyKirby } from './components/MyKirby.js';
import { MyLamp } from './components/MyLamp.js';
import { MyWindow } from './components/MyWindow.js';
import { MyVasel } from './components/MyVasel.js';
import { MyJournal } from './components/MyJournal.js';
import { MyFlower } from './components/MyFlower.js';
import { MySpring } from './components/MySpring.js';
import { MyPainting } from './components/MyPainting.js';

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

    // components
    this.cake = null;
    this.candle = null;
    this.plate = null;
    this.table = null;
    this.walls = null;
    this.floor = null;
    this.picture1 = null;
    this.picture2 = null;
    this.lamp1 = null;
    this.lamp2 = null;
    this.window = null;
    this.vase = null;
    this.journal = null;
    this.flower = null;
    this.spring = null;
    this.painting = null;

    // spotLight related attributes
    this.candleLight = null;
    this.candleLightTarget = null;
    this.candleLightHelper = null;
  }

  /**
   * initializes the contents
   */
  init() {
    // create once
    /*
    if (this.axis === null) {
      // create and attach the axis to the scene
      this.axis = new MyAxis(this);
      this.app.scene.add(this.axis);
    }*/

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

    // add a spot light on top of the cake
    this.candleLight = new THREE.SpotLight(
      0xffffff,
      4,
      1.5,
      Math.PI /4.5,
      0,
      0,
    );
    this.candleLight.position.set(0.1, 1.6, -0.4);
    this.candleLight.castShadow = true;

    this.app.scene.add(this.candleLight);

    this.candleLight.shadow.mapSize.width = 512;
    this.candleLight.shadow.mapSize.height = 512;
    this.candleLight.shadow.camera.near = 0.1;
    this.candleLight.shadow.camera.far = 1.5;
    this.candleLight.focus = 1;


    // add a target for the previous spot light
    this.candleLightTarget = new THREE.Object3D();
    this.candleLightTarget.position.set(0, 1.3, 0);
    this.app.scene.add(this.candleLight.target);
    this.app.scene.add(this.candleLightTarget);
    this.candleLight.target = this.candleLightTarget;

    //--------------------------------------------------------------------------------

    // add an ambient light
    const ambientLight = new THREE.AmbientLight(0x555555);
    this.app.scene.add(ambientLight);

    //--------------------------------------------------------------------------------

    // build components
    this.cake = new MyCake(this.app.scene);
    this.candle = new MyCandle(this.app.scene);
    this.plate = new MyPlate(this.app.scene);
    this.table = new MyTable(this.app.scene);
    this.walls = new MyWalls(this.app.scene);
    this.floor = new MyFloor(this.app.scene);
    this.door = new MyDoor(this.app.scene);
    this.picture1 = new MyPicture(this.app.scene, "202004646.jpg");
    this.picture2 = new MyPicture(this.app.scene, "202004724.jpg");
    this.clock = new MyClock(this.app.scene);
    this.rug = new MyRug(this.app.scene);
    this.kirby = new MyKirby(this.app.scene);
    this.lamp1 = new MyLamp(this.app.scene, "202004646");
    this.lamp2 = new MyLamp(this.app.scene, "202004724");
    this.window = new MyWindow(this.app.scene);
    this.vase = new MyVasel(this.app.scene);
    this.journal = new MyJournal(this.app.scene);
    this.flower = new MyFlower(this.app.scene);
    this.spring = new MySpring(this.app.scene);
    this.painting = new MyPainting(this.app.scene);

    // adjust components position
    this.cake.cakeMesh.position.set(0.0, 1.2, 0.0);
    this.cake.cakeMesh2.position.set(0.0, 1.3, 0.0);
    this.candle.candleMesh.position.set(0.1, 1.3, -0.1);
    this.plate.plateMesh.position.set(0.0, 1.1, 0.0);
    this.table.tableMesh.position.set(0.0, 1.0, 0.0);
    this.floor.floorMesh.position.set(0.0, 0.0, 0.0);
    this.door.doorMesh.position.set(5.0, 1.5, 0.0);
    this.picture1.pictureMesh.position.set(1.5, 5, -4.9);
    this.picture2.pictureMesh.position.set(-1.5, 5, -4.9);
    this.clock.clockMesh.position.set(4.9, 5.0, 0.0);
    this.rug.rugMesh.position.set(0.0, 0.0, 0.0);
    this.vase.vaseMesh.position.set(0.5, 1.60, 0.6);
    this.journal.journalMesh.position.set(-0.5, 1.20, -0.6);
    this.flower.flowerMesh.position.set(0.5, 1.7, 0.7);
    this.spring.springMesh.position.set(0.5, 1.10, -0.6);
  }

  /**
   * updates the cake topping color
   */
  updateCakeTopping(color) {
    this.cake.cakeMesh2.material.color.set(color);
  }

  /**
   * updates the contents
   * this method is called from the render method of the app
   *
   */
  update() {

  }
}

export { MyContents };


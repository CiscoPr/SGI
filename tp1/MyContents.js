import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFloor } from './components/MyFloor.js';
import { MyWalls } from './components/MyWalls.js';
import { MyCake } from './components/MyCake.js';
import { MyCandle } from './components/MyCandle.js';
import { MyPlate } from './components/MyPlate.js';
import { MyTable } from './components/MyTable.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';
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

    // spotLight related attributes
    this.candleLight = null;
    this.candleLightTarget = null;
    this.candleLightHelper = null;

    this.spotLight = null
    this.spotLightTarget = null
    this.spotLightHelper = null
  }

  /*
  buildBox() {
    this.cubeTexture = new THREE.TextureLoader().load(
      "textures/feup_entry.jpg"
    );

    this.cubeTexture.wrapS = THREE.RepeatWrapping;

    this.cubeTexture.wrapT = THREE.RepeatWrapping;

    this.diffuseCubeColor = "rgb(128,128,128)";

    this.specularCubeColor = "rgb(0,0,0)";

    this.cubeShininess = 0;

    let boxMaterial = new THREE.MeshPhongMaterial({
      color: this.diffuseCubeColor,

      specular: this.specularCubeColor,

      emissive: "#000000",
      shininess: this.cubeShininess,

      map: this.cubeTexture,
    });

    // Create a Cube Mesh with basic material
    let box = new THREE.BoxGeometry(
      this.boxMeshSize,
      this.boxMeshSize,
      this.boxMeshSize
    );
    this.boxMesh = new THREE.Mesh(box, boxMaterial);
    this.boxMesh.position.y = 5;
    this.app.scene.add(this.boxMesh);
  }

  */

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

    // variables to hold the curves
    this.polyline = null;
    this.quadraticBezierCurve = null;
    // number of samples to use for the curves (not for polyline)
    this.numberOfSamples = 16;

    // hull material and geometry
    this.hullMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0.5,
      transparent: true,
    });

    // curve recomputation
    this.recompute();
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

    // add a spot light on top of the model
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
    // add a spot light helper for the previous spot light
    //this.candleLightHelper = new THREE.SpotLightHelper( this.candleLight );
    //this.app.scene.add( this.candleLightHelper );

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
  
    //this.buildBox();
    this.buildCarPictureBackground();
  }

  // Deletes the contents of the line if it exists and recreates them

  recompute() {
    if (this.polyline !== null) this.app.scene.remove(this.polyline);
    if (this.quadraticBezierCurve !== null)
      this.app.scene.remove(this.quadraticBezierCurve);

    this.initCurveCar();
  }

  /*
  drawHull(position, points) {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    let line = new THREE.Line(geometry, this.hullMaterial);

    // set initial position

    line.position.set(position.x, position.y, position.z);

    this.app.scene.add(line);
  }
  */

  //+3 y
  initCurveCar() {
    let pointsTire1 = [
      new THREE.Vector3(-2.5, 3, 4.98),
      new THREE.Vector3(-2, 4, 4.98),
      new THREE.Vector3(-1, 4, 4.98),
      new THREE.Vector3(-0.5, 3, 4.98),
    ];

    let pointsTire2 = [
      new THREE.Vector3(0.5, 3, 4.98),
      new THREE.Vector3(1, 4, 4.98),
      new THREE.Vector3(2, 4, 4.98),
      new THREE.Vector3(2.5, 3, 4.98),
    ];

    // quadratic since we only need to specify 3 points
    let pointsHalfCar = [
      new THREE.Vector3(2.5, 3, 4.98),
      new THREE.Vector3(2.5, 5.5, 4.98),
      new THREE.Vector3(0.0, 5.5, 4.98),
    ];

    let frontCar = [
        new THREE.Vector3(0.0, 5.5, 4.98),
        new THREE.Vector3(-1.5, 5.5, 4.98),
        new THREE.Vector3(-1.5, 4.25, 4.98),
    ];

    let hoodCar = [
        new THREE.Vector3(-1.5, 4.25, 4.98),
        new THREE.Vector3(-2.5, 4.25, 4.98),
        new THREE.Vector3(-2.5, 3, 4.98),
    ];

    let position = new THREE.Vector3(0, 0, 0);

    /*
    this.drawHull(position, pointsTire1);
    this.drawHull(position, pointsTire2);
    this.drawHull(position, pointsHalfCar);
    this.drawHull(position, frontCar);
    this.drawHull(position, hoodCar);
    */

    let curveTire1 = new THREE.CubicBezierCurve3(
      pointsTire1[0],
      pointsTire1[1],
      pointsTire1[2],
      pointsTire1[3]
    );

    let curveTire2 = new THREE.CubicBezierCurve3(
      pointsTire2[0],
      pointsTire2[1],
      pointsTire2[2],
      pointsTire2[3]
    );

    let curveHalfCar = new THREE.QuadraticBezierCurve3(
      pointsHalfCar[0],
      pointsHalfCar[1],
      pointsHalfCar[2]
    );

    let curveFrontCar = new THREE.QuadraticBezierCurve3(
        frontCar[0],
        frontCar[1],
        frontCar[2]
    );

    let curveHoodCar = new THREE.QuadraticBezierCurve3(
        hoodCar[0],
        hoodCar[1],
        hoodCar[2]
    );

    // sample a number of points on the curve

    let sampledPointsTire1 = curveTire1.getPoints(this.numberOfSamples);
    let sampledPointsTire2 = curveTire2.getPoints(this.numberOfSamples);
    let sampledPointsHalfCar = curveHalfCar.getPoints(this.numberOfSamples);
    let sampledPointsFrontCar = curveFrontCar.getPoints(this.numberOfSamples);
    let sampledPointsHoodCar = curveHoodCar.getPoints(this.numberOfSamples);

    this.curveGeometryTire1 = new THREE.BufferGeometry().setFromPoints(
      sampledPointsTire1
    );

    this.curveGeometryTire2 = new THREE.BufferGeometry().setFromPoints(
      sampledPointsTire2
    );

    this.curveGeometryHalfCar = new THREE.BufferGeometry().setFromPoints(
      sampledPointsHalfCar
    );

    this.curveGeometryFrontCar = new THREE.BufferGeometry().setFromPoints(
        sampledPointsFrontCar
    );

    this.curveGeometryHoodCar = new THREE.BufferGeometry().setFromPoints(
        sampledPointsHoodCar
    );

    this.lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    this.lineObjTire1 = new THREE.Line(
      this.curveGeometryTire1,
      this.lineMaterial
    );
    this.lineObjTire2 = new THREE.Line(
      this.curveGeometryTire2,
      this.lineMaterial
    );
    this.lineObjHalfCar = new THREE.Line(
      this.curveGeometryHalfCar,
      this.lineMaterial
    );
    this.lineObjFrontCar = new THREE.Line(
        this.curveGeometryFrontCar,
        this.lineMaterial
    );

    this.lineObjHoodCar = new THREE.Line(
        this.curveGeometryHoodCar,
        this.lineMaterial
    );

    this.lineObjTire1.position.set(position.x, position.y, position.z);
    this.lineObjTire2.position.set(position.x, position.y, position.z);
    this.lineObjHalfCar.position.set(position.x, position.y, position.z);
    this.lineObjFrontCar.position.set(position.x, position.y, position.z);
    this.lineObjHoodCar.position.set(position.x, position.y, position.z);

    this.app.scene.add(this.lineObjTire1);
    this.app.scene.add(this.lineObjTire2);
    this.app.scene.add(this.lineObjHalfCar);
    this.app.scene.add(this.lineObjFrontCar);
    this.app.scene.add(this.lineObjHoodCar);
  }

  buildCarPictureBackground(){
    // it should be a white plane
    let planeMaterial = new THREE.MeshPhongMaterial({
        color: "#ffffff",
        specular: "#000000",
        emissive: "#000000",
        shininess: 90,
    });

    let plane = new THREE.PlaneGeometry(5.5, 3);
    this.carPictureBackground = new THREE.Mesh(plane, planeMaterial);

    this.carPictureBackground.position.y = 4.25;

    this.carPictureBackground.position.z = 4.99;

    this.carPictureBackground.position.x = 0;

    this.carPictureBackground.rotation.y = Math.PI;

    // borders to the picture
    let borderUpper = new THREE.BoxGeometry(5.5, 0.1, 0.1);
    let borderLower = new THREE.BoxGeometry(5.5, 0.1, 0.1);
    let borderLeft = new THREE.BoxGeometry(0.1, 3, 0.1);
    let borderRight = new THREE.BoxGeometry(0.1, 3, 0.1);

    let borderMaterial = new THREE.MeshPhongMaterial({
        color: "#753500",
        specular: "#000000",
        emissive: "#000000",
        shininess: 90,
    });

    let borderMeshUpper = new THREE.Mesh(borderUpper, borderMaterial);
    let borderMeshLower = new THREE.Mesh(borderLower, borderMaterial);
    let borderMeshLeft = new THREE.Mesh(borderLeft, borderMaterial);
    let borderMeshRight = new THREE.Mesh(borderRight, borderMaterial);

    borderMeshUpper.position.y = 5.7;
    borderMeshUpper.position.z = 5;

    borderMeshLower.position.y = 2.75;
    borderMeshLower.position.z = 5;

    borderMeshLeft.position.y = 4.25;
    borderMeshLeft.position.z = 5;
    borderMeshLeft.position.x = -2.75;

    borderMeshRight.position.y = 4.25;
    borderMeshRight.position.z = 5;
    borderMeshRight.position.x = 2.75;

    //adds the borders to the scene
    this.app.scene.add(borderMeshUpper);
    this.app.scene.add(borderMeshLower);
    this.app.scene.add(borderMeshLeft);
    this.app.scene.add(borderMeshRight);



    this.app.scene.add(this.carPictureBackground);
  }

  /**
   * updates the diffuse plane color and the material
   * @param {THREE.Color} value
   */
  /*updateDiffusePlaneColor(value) {
    this.diffusePlaneColor = value;
    this.planeMaterial.color.set(this.diffusePlaneColor);
  }
  /**
   * updates the specular plane color and the material
   * @param {THREE.Color} value
   */
  /*updateSpecularPlaneColor(value) {
    this.specularPlaneColor = value;
    this.planeMaterial.specular.set(this.specularPlaneColor);
  }
  /**
   * updates the plane shininess and the material
   * @param {number} value
   */
  /*updatePlaneShininess(value) {
    this.planeShininess = value;
    this.planeMaterial.shininess = this.planeShininess;
  }

  updatePlaneTexture(value) {
    if (value == "ClampToEdgeWrapping") {
      this.planeTexture.wrapS = THREE.ClampToEdgeWrapping;
    } else if (value == "RepeatWrapping") {
      this.planeTexture.wrapS = THREE.RepeatWrapping;
    } else if (value == "MirroredRepeatWrapping") {
      this.planeTexture.wrapS = THREE.MirroredRepeatWrapping;
    }
    this.planeMaterial.needsUpdate = true;
  }

  /**
   * rebuilds the box mesh if required
   * this method is called from the gui interface
   */
  /* rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {
            this.app.scene.remove(this.boxMesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    } */

  /**
   * updates the box mesh if required
   * this method is called from the render method of the app
   * updates are trigered by boxEnabled property changes
   */
  /* updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh)
            }
            else {
                this.app.scene.remove(this.boxMesh)
            }
        }
    } */

  /**
   * updates the contents
   * this method is called from the render method of the app
   *
   */
  update() {
    // check if box mesh needs to be updated
    // this.updateBoxIfRequired()
    // sets the box mesh position based on the displacement vector
    /* this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z */
  }
}

export { MyContents };


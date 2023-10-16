import * as THREE from 'three';
import { MyNurbsBuilder } from './../MyNurbsBuilder.js';

/**
 *  Painting class
 */
class MyPainting {
  /**
    constructs the object
    @param {THREE.Scene} scene The application scene
  */
  constructor(scene) {
    this.scene = scene;

    // app properties
    this.paintingMesh = null;
    this.car = null;

    // Painting geometry properties
    this.numberOfSamples = 16;

    // Painting material properties
    this.color = "#ffffff";
    this.borderColor = "#753500";
    this.specular = "#000000";
    this.emissive = "#000000";
    this.shininess = 90;

    // curve recomputation
    this.initCurveCar();

    // build the Painting mesh
    this.buildPainting();
  }

  initCurveCar() {
    let position = new THREE.Vector3(0, 0, 0);

    const curveTire1 = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-2.5, 3, 4.98),
      new THREE.Vector3(-2, 4, 4.98),
      new THREE.Vector3(-1, 4, 4.98),
      new THREE.Vector3(-0.5, 3, 4.98)
    );

    const curveTire2 = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0.5, 3, 4.98),
      new THREE.Vector3(1, 4, 4.98),
      new THREE.Vector3(2, 4, 4.98),
      new THREE.Vector3(2.5, 3, 4.98)
    );

    const curveHalfCar = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(2.5, 3, 4.98),
      new THREE.Vector3(2.5, 5.5, 4.98),
      new THREE.Vector3(0.0, 5.5, 4.98),
    );

    const curveFrontCar = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0.0, 5.5, 4.98),
      new THREE.Vector3(-1.5, 5.5, 4.98),
      new THREE.Vector3(-1.5, 4.25, 4.98),
    );

    const curveHoodCar = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-1.5, 4.25, 4.98),
      new THREE.Vector3(-2.5, 4.25, 4.98),
      new THREE.Vector3(-2.5, 3, 4.98),
    );

    // sample a number of points on the curve

    const sampledPointsTire1 = curveTire1.getPoints(this.numberOfSamples);
    const sampledPointsTire2 = curveTire2.getPoints(this.numberOfSamples);
    const sampledPointsHalfCar = curveHalfCar.getPoints(this.numberOfSamples);
    const sampledPointsFrontCar = curveFrontCar.getPoints(this.numberOfSamples);
    const sampledPointsHoodCar = curveHoodCar.getPoints(this.numberOfSamples);

    const curveGeometryTire1 = new THREE.BufferGeometry().setFromPoints(
      sampledPointsTire1
    );

    const curveGeometryTire2 = new THREE.BufferGeometry().setFromPoints(
      sampledPointsTire2
    );

    const curveGeometryHalfCar = new THREE.BufferGeometry().setFromPoints(
      sampledPointsHalfCar
    );

     const curveGeometryFrontCar = new THREE.BufferGeometry().setFromPoints(
        sampledPointsFrontCar
    );

    const curveGeometryHoodCar = new THREE.BufferGeometry().setFromPoints(
        sampledPointsHoodCar
    );

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

    let lineObjTire1 = new THREE.Line(
      curveGeometryTire1,
      lineMaterial
    );

    let lineObjTire2 = new THREE.Line(
      curveGeometryTire2,
      lineMaterial
    );

    let lineObjHalfCar = new THREE.Line(
      curveGeometryHalfCar,
      lineMaterial
    );

    let lineObjFrontCar = new THREE.Line(
      curveGeometryFrontCar,
      lineMaterial
    );

    let lineObjHoodCar = new THREE.Line(
      curveGeometryHoodCar,
      lineMaterial
    );

    lineObjTire1.position.set(position.x, position.y, position.z);
    lineObjTire2.position.set(position.x, position.y, position.z);
    lineObjHalfCar.position.set(position.x, position.y, position.z);
    lineObjFrontCar.position.set(position.x, position.y, position.z);
    lineObjHoodCar.position.set(position.x, position.y, position.z);

    this.car = new THREE.Group();
    this.car.add(lineObjTire1);
    this.car.add(lineObjTire2);
    this.car.add(lineObjHalfCar);
    this.car.add(lineObjFrontCar);
    this.car.add(lineObjHoodCar);

    this.scene.add(this.car);
  }

  buildPainting() {
    // it should be a white plane
    let planeMaterial = new THREE.MeshPhongMaterial({
      color: this.color,
      specular: this.specular,
      emissive: this.emissive,
      shininess: this.shininess,
    });

    let plane = new THREE.PlaneGeometry(5.5, 3);
    this.carPictureBackground = new THREE.Mesh(plane, planeMaterial);

    this.carPictureBackground.position.set(0, 4.25, 4.99);
    this.carPictureBackground.rotation.y = Math.PI;

    // borders to the picture
    let borderUpper = new THREE.BoxGeometry(5.5, 0.1, 0.1);
    let borderLower = new THREE.BoxGeometry(5.5, 0.1, 0.1);
    let borderLeft = new THREE.BoxGeometry(0.1, 3, 0.1);
    let borderRight = new THREE.BoxGeometry(0.1, 3, 0.1);

    let borderMaterial = new THREE.MeshPhongMaterial({
        color: this.borderColor,
        specular: this.specular,
        emissive: this.emissive,
        shininess: this.emissive,
    });

    let borderMeshUpper = new THREE.Mesh(borderUpper, borderMaterial);
    let borderMeshLower = new THREE.Mesh(borderLower, borderMaterial);
    let borderMeshLeft = new THREE.Mesh(borderLeft, borderMaterial);
    let borderMeshRight = new THREE.Mesh(borderRight, borderMaterial);

    borderMeshUpper.position.set(0, 5.7, 5);

    borderMeshLower.position.set(0, 2.75, 5);

    borderMeshLeft.position.set(-2.75, 4.25, 5);

    borderMeshRight.position.set(2.75, 4.25, 5);

    //adds the borders to the scene
    this.scene.add(borderMeshUpper);
    this.scene.add(borderMeshLower);
    this.scene.add(borderMeshLeft);
    this.scene.add(borderMeshRight);

    this.scene.add(this.carPictureBackground);
  }
   
}

export { MyPainting };
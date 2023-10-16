import * as THREE from 'three';

/**
 *  Cake class
 */
class MyCake {
  /**
    constructs the object
    @param {THREE.Scene} scene The application scene
  */
  constructor(scene) {
    this.scene = scene;
    
    // app properties
    this.cakeMesh = null;
    this.castShadow = true;
    this.receiveShadow = true;

    // cake material properties
    this.color = "#63452c";
    this.specular = "#cdab8f";
    this.emissive = "#000000";
    this.shininess = 90;

    // build the cake mesh
    this.buildCake();
  }

  buildCake() {
    let cakeMaterial = new THREE.MeshPhongMaterial({
      color: this.color,
      specular: this.specular,
      emissive: this.emissive,
      shininess: this.shininess,
    });

    // build the cake mesh
    let cake = new THREE.CylinderGeometry(
      0.3,
      0.3,
      0.2,
      32,
      1,
      false,
      0,
      (7 * Math.PI) / 4
    );
    this.cakeMesh = new THREE.Mesh(cake, cakeMaterial);

    // create child geometry
    let plane = new THREE.PlaneGeometry(0.2, 0.6);

    // create plane mesh
    let planeMesh1 = new THREE.Mesh(plane, cakeMaterial);
    planeMesh1.rotation.z = Math.PI / 2;
    planeMesh1.rotation.y = Math.PI / 4;
    // create plane mesh
    let planeMesh2 = new THREE.Mesh(plane, cakeMaterial);
    planeMesh2.rotation.z = Math.PI / 2;
    planeMesh2.rotation.y = -Math.PI / 2;

    // add planes to the cake mesh
    this.cakeMesh.add(planeMesh1);
    this.cakeMesh.add(planeMesh2);

    // cake mesh must cast shadow
    this.cakeMesh.castShadow = true;
    this.cakeMesh.receiveShadow = true;

    // add cake mesh to the scene
    this.scene.add(this.cakeMesh);
  }
   
  rebuildCake() {
    // remove boxMesh if exists
    if (this.cakeMesh !== undefined && this.cakeMesh !== null) {
        this.scene.remove(this.cakeMesh)
    }
    this.buildCake();
  }
}

export { MyCake };
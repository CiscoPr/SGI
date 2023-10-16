import * as THREE from 'three';

/**
 *  Plate class
 */
class MyPlate {
  /**
    constructs the object
    @param {THREE.Scene} scene The application scene
  */
  constructor(scene) {
    this.scene = scene;
    
    // app properties
    this.plateMesh = null;

    // Plate material properties
    this.color = "#ffffff";
    this.specular = "#000000";
    this.emissive = "#000000";
    this.shininess = 90;

    // build the plate mesh
    this.buildPlate();
  }

  buildPlate() {
    let plateMaterial = new THREE.MeshPhongMaterial({
        color: this.color,
        specular: this.specular,
        emissive: this.emissive,
        shininess: this.shininess,
      });
  
    // build the plate mesh
    let plateGeometry = new THREE.CylinderGeometry(0.35, 0.25, 0.1);
    this.plateMesh = new THREE.Mesh(plateGeometry, plateMaterial);
  
    // add plate to the scene
    this.scene.add(this.plateMesh);
  }
   
  rebuildPlate() {
    // remove PlateMesh if exists
    if (this.plateMesh !== undefined && this.plateMesh !== null) {
        this.scene.remove(this.plateMesh)
    }
    this.buildPlate();
  }
}

export { MyPlate };
import * as THREE from 'three';

/**
 *  Lamp class
 */
class MyLamp {
  /**
    constructs the object
    @param {THREE.Scene} scene The application scene
  */
  constructor(scene, studentNumber) {
    this.scene = scene;
    this.studentNumber = studentNumber;
    
    // app properties
    this.lampMesh = null;

    // Lamp material properties
    this.color = "#000000";
    this.specular = "#000000";
    this.emissive = "#000000";
    this.shininess = 90;

    // build the Lamp mesh
    this.buildLamp(this.studentNumber);
  }

  buildLamp(studentNumber) {
    let lampMaterial = new THREE.MeshPhongMaterial({
        color: this.color,
        specular: this.specular,
        emissive: this.emissive,
        shininess: this.shininess,
    });
    let lamp = new THREE.ConeGeometry(0.4, 0.3, 32);
  
    let lampMesh = new THREE.Mesh(lamp, lampMaterial);
    
    if(studentNumber == "202004646") lampMesh.position.set(1.5, 6.2, -5);
    else lampMesh.position.set(-1.5, 6.2, -5);
  
    //create a spot light
    let spotLight = new THREE.SpotLight(
      0xffffff,
      10,
      3,
      Math.PI / 4,
      0.5,
    );
  
    if(studentNumber == "202004646") spotLight.position.set(1.5, 6.2, -4.8);
    else spotLight.position.set(-1.5, 6.2, -4.8);
    this.scene.add(spotLight);
    spotLight.castShadow = true;
  
    spotLight.shadow.mapSize.width = 512;
    spotLight.shadow.mapSize.height = 512;
    spotLight.shadow.camera.near = 0.1;
    spotLight.shadow.camera.far = 1.5;
    spotLight.focus = 1;
  
    // add a target for the previous spot light
    let spotLightTarget = new THREE.Object3D();
    if(studentNumber == "202004646") spotLightTarget.position.set(1.5, 5.2, -4.8);
    else spotLightTarget.position.set(-1.5, 5.2, -4.8);
  
    this.scene.add(spotLight.target);
    this.scene.add(spotLightTarget);
    spotLight.target = spotLightTarget;
  
    if(studentNumber == "202004646") lampMesh.position.x = 1.5;
    else lampMesh.position.x = -1.5;
  
    this.scene.add(lampMesh);
  }
   
  rebuildLamp() {
    // remove lampMesh if exists
    if (this.lampMesh !== undefined && this.lampMesh !== null) {
        this.scene.remove(this.lampMesh)
        this.scene.remove(this.spotLight)
        this.scene.remove(this.spotLightTarget)
    }
    this.buildLamp(this.studentNumber);
  }
}

export { MyLamp };
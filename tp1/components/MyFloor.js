import * as THREE from 'three';

/**
 *  Floor class
 */
class MyFloor {
  /**
    constructs the object
    @param {THREE.Scene} scene The application scene
  */
  constructor(scene) {
    this.scene = scene;
    
    // app properties
    this.floorMesh = null;

    // Floor material properties
    this.floorTexture = new THREE.TextureLoader().load("textures/floor.jpg");
    this.diffuse = "rgb(128,0,0)";
    this.emissive = "rgb(0,0,0)";

    // build the Floor mesh
    this.buildFloor();
  }

  buildFloor() {
    let planeSizeU = 10;
    let planeSizeV = 10;
    let planeUVRate = planeSizeV / planeSizeU;
    let planeTextureUVRate = 3354 / 2385; // image dimensions
    let planeTextureRepeatU = 1;
    let planeTextureRepeatV =  planeTextureRepeatU * planeUVRate * planeTextureUVRate;
   
    this.floorTexture.repeat.set(planeTextureRepeatU, planeTextureRepeatV);
    this.floorTexture.rotation = 0;
    this.floorTexture.offset = new THREE.Vector2(0, 0);
    this.floorTexture.wrapS = THREE.RepeatWrapping;
    this.floorTexture.wrapT = THREE.RepeatWrapping;

    let floorMaterial = new THREE.MeshLambertMaterial({
      color: this.diffuse,
      emissive: this.emissive,
      map: this.floorTexture
    });
    let floorGeometry = new THREE.PlaneGeometry(planeSizeU, planeSizeV);
    
    this.floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    this.floorMesh.castShadow = false;
    this.floorMesh.receiveShadow = true;
   
    this.floorMesh.rotation.x = -Math.PI / 2;
   
    this.scene.add(this.floorMesh);
  }
   
  rebuildFloor() {
    // remove floorMesh if exists
    if (this.floorMesh !== undefined && this.floorMesh !== null) {
        this.scene.remove(this.floorMesh)
    }
    this.buildFloor();
  }
}

export { MyFloor };
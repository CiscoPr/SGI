import * as THREE from 'three';

/**
 *  Picture class
 */
class MyPicture {
  /**
    constructs the object
    @param {THREE.Scene} scene The application scene
  */
  constructor(scene, up) {
    this.scene = scene;
    
    // app properties
    this.pictureMesh = null;

    // Picture material properties
    this.pictureTexture = new THREE.TextureLoader().load("textures/" + up);
    this.pictureTexture.wrapS = THREE.RepeatWrapping;
    this.pictureTexture.wrapT = THREE.RepeatWrapping;
    this.diffuse = "rgb(128,128,128)";
    this.specular = "rgb(0,0,0)";
    this.emissive = "#000000";
    this.shininess = 0;

    // build the Picture mesh
    this.buildPicture();
  }

  buildPicture() {
    let pictureMaterial = new THREE.MeshPhongMaterial({
      color: this.diffuse,
      specular: this.specular,
      emissive: this.emissive,
      shininess: this.shininess,
      map: this.pictureTexture,
    });
    let picture = new THREE.PlaneGeometry(1, 1.5);

    this.pictureMesh = new THREE.Mesh(picture, pictureMaterial);

    this.pictureMesh.castShadow = true;
    this.pictureMesh.receiveShadow = true;

    this.scene.add(this.pictureMesh);
  }
   
  rebuildPicture() {
    // remove pictureMesh if exists
    if (this.pictureMesh !== undefined && this.pictureMesh !== null) {
        this.scene.remove(this.pictureMesh)
    }
    this.buildPicture();
  }
}

export { MyPicture };
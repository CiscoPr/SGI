import * as THREE from 'three';

/**
 *  Walls class
 */
class MyWalls {
  /**
    constructs the object
    @param {THREE.Scene} scene The application scene
  */
  constructor(scene) {
    this.scene = scene;
    
    // app properties
    this.wallsMesh = null;

    // Walls material properties
    this.wallTexture = new THREE.TextureLoader().load("textures/wall_texture.jpg");
    this.diffuse = "rgb(256,256,256)";
    this.specular = "rgb(0,0,0)";
    this.emissive = "rgb(0,0,0)";
    this.shininess = 0;

    // build the Walls mesh
    this.buildWalls();
  }

  buildWalls() {
    let wallMaterial = new THREE.MeshPhongMaterial({
      color: this.diffuse,
      specular: this.specular,
      emissive: this.emissive,
      shininess: this.shininess,
      map: this.wallTexture,
    });
    let wallGeometry = new THREE.PlaneGeometry(10, 8);

    let wallMesh1 = new THREE.Mesh(wallGeometry, wallMaterial);
    wallMesh1.rotation.y = Math.PI;
    wallMesh1.position.set(0, 4, 5);

    let wallMesh2 = new THREE.Mesh(wallGeometry, wallMaterial);
    wallMesh2.rotation.y = Math.PI / 2;
    wallMesh2.position.set(-5, 4, 0);

    let wallMesh3 = new THREE.Mesh(wallGeometry, wallMaterial);
    wallMesh3.position.set(0, 4, -5);

    let wallMesh4 = new THREE.Mesh(wallGeometry, wallMaterial);
    wallMesh4.rotation.y = -Math.PI / 2;
    wallMesh4.position.set(5, 4, 0);

    this.walls = new THREE.Group();
    this.walls.add(wallMesh1);
    this.walls.add(wallMesh2);
    this.walls.add(wallMesh3);
    this.walls.add(wallMesh4);

    this.scene.add(this.walls);
  }
   
  rebuildWalls() {
    // remove wallsMesh if exists
    if (this.wallsMesh !== undefined && this.wallsMesh !== null) {
        this.scene.remove(this.wallsMesh)
    }
    this.buildWalls();
  }
}

export { MyWalls };
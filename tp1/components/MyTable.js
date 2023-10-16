import * as THREE from 'three';

/**
 *  Table class
 */
class MyTable {
  /**
    constructs the object
    @param {THREE.Scene} scene The application scene
  */
  constructor(scene) {
    this.scene = scene;
    
    // app properties
    this.tableMesh = null;

    // Table material properties
    this.tableTexture = new THREE.TextureLoader().load("textures/wood.jpg");
    this.color = "#684500";
    this.specular = "#000000";
    this.emissive = "#000000";
    this.shininess = 90;
    this.legDiffuse = "rgb(87, 52, 0)";
    this.legSpecular = "rgb(128, 128, 128)";
    this.legEmissive = "rgb(0, 0, 0)";
    this.legShininess = 90;

    // build the Table mesh
    this.buildTable();
  }

  buildTable() {
    let legMaterial = new THREE.MeshPhongMaterial({
      color: this.legDiffuse,
      specular: this.legSpecular,
      emissive: this.legEmissive,
      shininess: this.legShininess,
    });

    let tableMaterial = new THREE.MeshPhongMaterial({
      color: this.color,
      specular: this.specular,
      emissive: this.emissive,
      shininess: this.shininess,
      map: this.tableTexture,
    });

    // Create a table Mesh with basic material
    let tableGeometry = new THREE.BoxGeometry(1.5, 2.0, 0.1);
    this.tableMesh = new THREE.Mesh(tableGeometry, tableMaterial);

    // Create each leg Mesh with basic material
    const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
    for (let i = 0; i < 4; i++) {
      let legMesh = new THREE.Mesh(legGeometry, legMaterial);
      legMesh.rotation.x = -Math.PI / 2;
      legMesh.position.x = i % 2 ? -0.6 : 0.6;
      legMesh.position.y = i < 2 ? -0.8 : 0.8;
      legMesh.position.z = -0.5;
      legMesh.castShadow = true;
      legMesh.receiveShadow = true;

      this.tableMesh.add(legMesh);
    }

    // adjust the table position
    this.tableMesh.rotation.x = -Math.PI / 2;

    this.tableMesh.castShadow = true;
    this.tableMesh.receiveShadow = true;
    
    // add the table to the scene
    this.scene.add(this.tableMesh);
  }
   
  rebuildTable() {
    // remove tableMesh if exists
    if (this.tableMesh !== undefined && this.tableMesh !== null) {
        this.scene.remove(this.tableMesh)
    }
    this.buildTable();
  }
}

export { MyTable };
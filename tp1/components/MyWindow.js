import * as THREE from 'three';

/**
 *  Window class
 */
class MyWindow {
  /**
    constructs the object
    @param {THREE.Scene} scene The application scene
  */
  constructor(scene) {
    this.scene = scene;

    // app properties
    this.windowMesh = null;
    this.windowLight = null;

    // Window material properties
    this.windowTexture = new THREE.TextureLoader().load("textures/nostalgia.jpg");
    this.windowTexture.wrapS = THREE.RepeatWrapping;
    this.windowTexture.wrapT = THREE.RepeatWrapping;
    this.color = "#ffffff";
    this.specular = "#000000";
    this.emissive = "#241f31";
    this.shininess = 90;

    // build the Window mesh
    this.buildWindow();
  }

  buildLigth() {
    // add a light for the window
    this.windowLight = new THREE.SpotLight(
      0xffffff,
      4,
      15,
      Math.PI / 5,
      0.1,
      0
    );

    this.windowLight.castShadow = true;
    this.windowLight.position.set(-6, 5, 0.0);

    this.scene.add(this.windowLight);

    this.windowLight.shadow.mapSize.width = 512;
    this.windowLight.shadow.mapSize.height = 512;
    this.windowLight.shadow.camera.near = 0.1;
    this.windowLight.shadow.camera.far = 1.5;
    this.windowLight.focus = 1;

    // add a target for the previous point light
    this.windowLightTarget = new THREE.Object3D();
    this.windowLightTarget.position.set(0.0, 0.0, 0.0);
    this.scene.add(this.windowLight.target);
    this.scene.add(this.windowLightTarget);
    this.windowLight.target = this.windowLightTarget;
  }

  buildWindow() {
    let windowMaterial = new THREE.MeshPhongMaterial({
      color: this.color,
      specular: this.specular,
      emissive: this.emissive,
      shininess: this.shininess,
      map: this.windowTexture,
    });
  
    let windowWidth = 5;
    let windowHeight = 2.5;
  
    //window border
    let borderUpper = new THREE.BoxGeometry(windowWidth, 0.1, 0.1);
    let borderLower = new THREE.BoxGeometry(windowWidth, 0.1, 0.1);
    let borderLeft = new THREE.BoxGeometry(0.1, windowHeight, 0.1);
    let borderRight = new THREE.BoxGeometry(0.1, windowHeight, 0.1);
    let borderMiddle = new THREE.BoxGeometry(0.1, windowHeight, 0.1);
  
    let borderMaterial = new THREE.MeshPhongMaterial({
      color: "#000000",
      specular: "#000000",
      emissive: "#000000",
      shininess: 90,
    });
  
    let borderMeshUpper = new THREE.Mesh(borderUpper, borderMaterial);
    let borderMeshLower = new THREE.Mesh(borderLower, borderMaterial);
    let borderMeshLeft = new THREE.Mesh(borderLeft, borderMaterial);
    let borderMeshRight = new THREE.Mesh(borderRight, borderMaterial);
    let borderMeshMiddle = new THREE.Mesh(borderMiddle, borderMaterial);
  
    //defines the position of the borders
    borderMeshUpper.rotation.y = Math.PI / 2;
    borderMeshUpper.position.y = 5 + windowHeight / 2;
    borderMeshUpper.position.x = -4.9;
  
    borderMeshLower.rotation.y = Math.PI / 2;
    borderMeshLower.position.y = 5 - windowHeight / 2;
    borderMeshLower.position.x = -4.9;
  
    borderMeshMiddle.position.y = 5;
    borderMeshMiddle.position.x = -4.9;
  
    borderMeshLeft.position.y = 5;
    borderMeshLeft.position.x = -4.9;
    borderMeshLeft.position.z = -windowWidth / 2 + 0.05;
  
    borderMeshRight.position.y = 5;
    borderMeshRight.position.x = -4.9;
    borderMeshRight.position.z = windowWidth / 2 - 0.05;
  
    let curtainTexture = new THREE.TextureLoader().load("textures/curtain.jpg");
  
    let curtainMaterial = new THREE.MeshPhongMaterial({
      color: "#ffffff",
      specular: "#000000",
      emissive: "#000000",
      shininess: 90,
      map: curtainTexture,
    });
    let curtainGeometry = new THREE.PlaneGeometry(4.9, 1.2);
  
    let curtainMesh = new THREE.Mesh(curtainGeometry, curtainMaterial);
    curtainMesh.rotation.y = Math.PI / 2;
    curtainMesh.position.set(-4.8, 5.65, 0);

    let window = new THREE.PlaneGeometry(windowWidth, windowHeight);
    this.windowMesh = new THREE.Mesh(window, windowMaterial);
    this.windowMesh.rotation.y = Math.PI / 2;
    this.windowMesh.position.y = 5;
    this.windowMesh.position.x = -4.9;
  
    //adds elements to the window
    this.scene.add(borderMeshUpper);
    this.scene.add(borderMeshLower);
    this.scene.add(borderMeshMiddle);
    this.scene.add(borderMeshLeft);
    this.scene.add(borderMeshRight);
    this.scene.add(curtainMesh);
  
    //adds the window to the scene
    this.scene.add(this.windowMesh);
    this.buildLigth();
  }
   
  rebuildWindow() {
    // remove windowMesh if exists
    if (this.windowMesh !== undefined && this.windowMesh !== null) {
        this.scene.remove(this.windowMesh)
        
    }
    this.buildWindow();
  }
}

export { MyWindow };
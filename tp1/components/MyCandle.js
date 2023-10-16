import * as THREE from 'three';

/**
 *  Candle class
 */
class MyCandle {
  /**
    constructs the object
    @param {THREE.Scene} scene The application scene
  */
  constructor(scene) {
    this.scene = scene;

    // app properties
    this.candleMesh = null;
    this.candleEnabled = true;
    this.lastCandleEnabled = null

    // candle material properties
    this.color = "#8ac6ff";
    this.specular = "#000000";
    this.emissive = "#8ac6ff";
    this.shininess = 90;

    // flame material properties
    this.flameColor = "#ffff77";
    this.flameSpecular = "#ff0000";
    this.flameEmissive = "#ff0000";
    this.flameShininess = 90;

    // build the candle mesh
    this.buildCandle();
  }

  buildCandle() {
    const wickMaterial = new THREE.MeshPhongMaterial({
      color: "#ffffff",
      specular: "#ff0000",
      emissive: "#ffffff",
      shininess: 90,
    });

    let flameMaterial = new THREE.MeshPhongMaterial({
      color: this.flameColor,
      specular: this.flameSpecular,
      emissive: this.flameEmissive,
      shininess: this.flameShininess,
    });

    let candleMaterial = new THREE.MeshPhongMaterial({
      color: this.color,
      specular: this.specular,
      emissive: this.emissive,
      shininess: this.shininess,
    });

    // build the flame mesh
    let flame = new THREE.CapsuleGeometry(0.016, 0.026);
    let flameMesh = new THREE.Mesh(flame, flameMaterial);
    flameMesh.position.y = 0.05;

    // build the wick mesh
    let wick = new THREE.CylinderGeometry(0.005, 0.005, 0.13);
    let wickMesh = new THREE.Mesh(wick, wickMaterial);

    // add flame to the wick
    wickMesh.add(flameMesh);

    // adjust the wick position
    wickMesh.position.y = 0.16;

    // build the candle mesh
    let candle = new THREE.CylinderGeometry(0.016, 0.016, 0.3);
    this.candleMesh = new THREE.Mesh(candle, candleMaterial);

    this.candleMesh.castShadow = true;
    // add wick to the candle
    this.candleMesh.add(wickMesh);

    // add flameMesh to the scene
    this.scene.add(this.candleMesh);
  }

  rebuildCandle() {
    // remove candleMesh if exists
    if (this.candleMesh !== undefined && this.candleMesh !== null) {
        this.scene.remove(this.candleMesh)
    }
    this.buildCandle();
  }
}

export { MyCandle };
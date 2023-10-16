import * as THREE from 'three';
import { MyNurbsBuilder } from './../MyNurbsBuilder.js';

/**
 *  Spring class
 */
class MySpring {
  /**
    constructs the object
    @param {THREE.Scene} scene The application scene
  */
  constructor(scene) {
    this.scene = scene;

    // app properties
    this.springMesh = null;

    // Spring geometry properties
    this.numberOfSamples = 1000

    // Spring material properties
    this.color = 0x767474;

    // build the Spring mesh
    this.buildSpring();
  }

  buildSpring() {
    let collection = [];
    for (let i = 0; i < 50; i++) {
      collection.push(new THREE.Vector3(Math.cos(i), Math.sin(i) , i ));
    }

    // create curve path
    const curve = new THREE.CatmullRomCurve3( collection );

    const sampledPoints = curve.getPoints( this.numberOfSamples );
    const curveGeometry = new THREE.BufferGeometry().setFromPoints( sampledPoints );

    const material = new THREE.LineBasicMaterial( { color: this.color } );

    // Create the final object to add to the scene
    this.springMesh = new THREE.Line( curveGeometry, material );

    this.springMesh.scale.set( 0.05, 0.05, 0.01 );

    this.scene.add(this.springMesh);
  }
   
  rebuildSpring() {
    // remove springMesh if exists
    if (this.springMesh !== undefined && this.springMesh !== null) {
        this.scene.remove(this.springMesh)
    }
    this.buildSpring();
  }
}

export { MySpring };
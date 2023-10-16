import * as THREE from 'three';
import { MyNurbsBuilder } from './../MyNurbsBuilder.js';

/**
 *  Flower class
 */
class MyFlower {
  /**
    constructs the object
    @param {THREE.Scene} scene The application scene
  */
  constructor(scene) {
    this.scene = scene;

    // app properties
    this.flowerMesh = null;

    // Flower geometry properties
    // petal control points
    this.controlPoints =

        [   // U = 0

            [ // V = 0..2;

                [ 0.0, 0.0, 0.0, 1 ],

                [ 0.0,  0.0, 0.0, 1 ],

                [ 0.0,  0.0, 0.0, 1 ]

            ],

            // U = 1

            [ // V = 0..2

                [ 1.5, 0.0, -1.5, 1 ],

                [ 1.5,  0.0, 0.0, 1 ],

                [ 1.5,  0.0, 1.5, 1 ]

            ],

            // U = 2

            [ // V = 0..2

                [ 3.0, 0.0, 0.0, 1 ],

                [ 3.0, 0.0, 0.0, 1 ],

                [ 3.0, 0.0, 0.0, 1 ]

            ]

        ]
    
    this.order = 2;
    this.numberSamples = 16;
    this.stemPoints = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0.0, 0.0, 0.0),
        new THREE.Vector3(0.0, -1.0, -0.5),
        new THREE.Vector3(0.0, -2.0, -0.5)
    );

    // Flower material properties
    this.petalColor = "#0000ff";
    this.centerColor = "#ffff00";
    this.stemColor = "#00ff00";
    

    // build the Flower mesh
    this.buildFlower();
  }

  buildFlower() {
    const builder = new MyNurbsBuilder();

    const petalMaterial = new THREE.MeshBasicMaterial( { color: this.petalColor, side: THREE.DoubleSide} );
    const surfaceData = builder.build(this.controlPoints, this.order, this.order, 
        this.numberSamples, this.numberSamples, petalMaterial);   

    const centerMaterial = new THREE.MeshBasicMaterial( { color: this.centerColor, side: THREE.DoubleSide} );
    const circleGeometry = new THREE.CircleGeometry(1);
    this.flowerMesh = new THREE.Mesh( circleGeometry, centerMaterial );
    
    const stemMaterial = new THREE.LineBasicMaterial({ color: this.stemColor });
    const stemGeometry = new THREE.BufferGeometry().setFromPoints( this.stemPoints.getPoints( this.numberSamples ) );
    let stemMesh = new THREE.Line( stemGeometry, stemMaterial );
    

    for(let i = 0; i < 6; i++) {
      let petalMesh = new THREE.Mesh( surfaceData, petalMaterial );
      petalMesh.rotation.y = i * Math.PI / 3;
      petalMesh.rotation.x = Math.PI / 2;
      petalMesh.position.set(Math.cos(i * Math.PI / 3), Math.sin(i * Math.PI / 3), 0.0);

      this.flowerMesh.add(petalMesh);
    }

    this.flowerMesh.scale.set( 0.1, 0.1, 0.1 );
    stemMesh.scale.set( 3, 3, 3 );
    this.flowerMesh.add(stemMesh);

    this.scene.add( this.flowerMesh );
  }
   
  rebuildFlower() {
    // remove flowerMesh if exists
    if (this.flowerMesh !== undefined && this.flowerMesh !== null) {
        this.scene.remove(this.flowerMesh)
    }
    this.buildFlower();
  }
}

export { MyFlower };
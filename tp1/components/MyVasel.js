import * as THREE from 'three';
import { MyNurbsBuilder } from './../MyNurbsBuilder.js';

/**
 *  Vasel class
 */
class MyVasel {
  /**
    constructs the object
    @param {THREE.Scene} scene The application scene
  */
  constructor(scene) {
    this.scene = scene;

    // app properties
    this.vaseMesh = null;

    // vasel geometry properties
    this.controlPoints =

        [   // U = 0

            [ // V = 0..2;

                [ 0.15, 0.0, 0.0, 1 ],

                [ 0.0,  0.0, -0.3, 1 ],

                [ -0.15,  0.0, 0.0, 1 ]

            ],

            // U = 1

            [ // V = 0..2

                [ 0.1, -1.0, 0.0, 1 ],

                [ 0.0,  -1.0, -0.2, 1 ],

                [ -0.1,  -1.0, 0.0, 1 ]

            ],

            // U = 2

            [ // V = 0..2

                [ 0.5, -2.0, 0.0, 1 ],

                [ 0.0, -2.0, -1.0, 1 ],

                [ -0.5, -2.0, 0.0, 1 ]

            ]

        ]
    this.order = 2;
    this.numberSamples = 16;

    // Vasel material properties
    this.vaselTexture = new THREE.TextureLoader().load( 'textures/vase.jpg' );
    this.vaselTexture.wrapS = this.vaselTexture.wrapT = THREE.RepeatWrapping;
    this.vaselTexture.anisotropy = 16;
    this.vaselTexture.colorSpace = THREE.SRGBColorSpace;

    // build the Vasel mesh
    this.buildVasel();
  }

  buildVasel() {
    const material = new THREE.MeshLambertMaterial( { map: this.vaselTexture,
        side: THREE.DoubleSide,
        transparent: true, opacity: 0.90 } );

    const builder = new MyNurbsBuilder();
    let surfaceData;

    // build surface
    surfaceData = builder.build(this.controlPoints, this.order, this.order, 
        this.numberSamples, this.numberSamples, material);

    this.vaseMesh = new THREE.Mesh( surfaceData, material );
    let vaseMesh2 = new THREE.Mesh( surfaceData, material );
    vaseMesh2.rotation.y = Math.PI;

    // add second surface to the first one
    this.vaseMesh.add(vaseMesh2);
    this.vaseMesh.scale.set( 0.3, 0.3, 0.3 );

    this.scene.add( this.vaseMesh );
  }
   
  rebuildVasel() {
    // remove vaselMesh if exists
    if (this.vaselMesh !== undefined && this.vaselMesh !== null) {
        this.scene.remove(this.vaselMesh)
        
    }
    this.buildVasel();
  }
}

export { MyVasel };
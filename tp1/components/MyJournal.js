import * as THREE from 'three';
import { MyNurbsBuilder } from './../MyNurbsBuilder.js';

/**
 *  Journal class
 */
class MyJournal {
  /**
    constructs the object
    @param {THREE.Scene} scene The application scene
  */
  constructor(scene) {
    this.scene = scene;

    // app properties
    this.journalMesh = null;

    // Journal geometry properties
    this.controlPoints =

        [   // U = 0

            [ // V = 0..2;

                [ 0.5, 0.0, -1.0, 1 ],

                [ 0.0,  -1.0, -1.0, 1 ],

                [ -0.5,  0.0, -1.0, 1 ]

            ],

            // U = 1

            [ // V = 0..2

                [ 0.5, 0.0, 0.0, 1 ],

                [ 0.0,  -1.0, 0.0, 1 ],

                [ -0.5,  0.0, 0.0, 1 ]

            ],

            // U = 2

            [ // V = 0..2

                [ 0.5, 0.0, 1.0, 1 ],

                [ 0.0, -1.0, 1.0, 1 ],

                [ -0.5,  0.0, 1.0, 1 ]

            ]

        ]
    this.order = 2;
    this.numberSamples = 16;

    // Journal material properties
    this.journalTexture = new THREE.TextureLoader().load( 'textures/newspaper.jpg' );
    this.journalTexture.wrapS = this.journalTexture.wrapT = THREE.RepeatWrapping;
    this.journalTexture.anisotropy = 16;
    this.journalTexture.colorSpace = THREE.SRGBColorSpace;

    // build the Journal mesh
    this.buildJournal();
  }

  buildJournal() {
    const material = new THREE.MeshLambertMaterial( { map: this.journalTexture,
        side: THREE.DoubleSide,
        transparent: true, opacity: 0.90 } );

    const builder = new MyNurbsBuilder();
    let surfaceData;

    // build surface
    surfaceData = builder.build(this.controlPoints, this.order, this.order, 
        this.numberSamples, this.numberSamples, material);

    this.journalMesh = new THREE.Mesh( surfaceData, material );
    this.journalMesh.scale.set( 0.3, 0.3, 0.3 );
    
    this.scene.add( this.journalMesh );
  }
   
  rebuildJournal() {
    // remove JournalMesh if exists
    if (this.JournalMesh !== undefined && this.JournalMesh !== null) {
        this.scene.remove(this.journalMesh)
    }
    this.buildJournal();
  }
}

export { MyJournal };
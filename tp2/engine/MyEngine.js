import * as THREE from 'three';
import { MyFileReader } from '../parser/MyFileReader.js';

/**
 *  This class contains the contents of out application
 */
class MyEngine  {

    /**
       constructs the object
       @param {MyApp} app The application object
       @param {MyContents} contents The contents object
    */ 
    constructor(app, contents) {
        this.app = app;
        this.contents = contents;
    }

    /**
     * initializes the engine
     */
    init() {

        
    }

    dealWithGlobals() {
        
    }

    
}

export { MyEngine };
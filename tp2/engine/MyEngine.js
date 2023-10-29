import * as THREE from 'three';
import { MySceneData } from './../parser/MySceneData.js';

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
        this.data = this.contents.reader.data;
    }

    /**
     * initializes the engine
     */
    init() {
        // check if there was an error while reading the scene file
        if (this.contents.readerError()) {
            console.error("Error ocurred while reading the scene file. Check the console for details.");
            return;
        }

        console.info("------------------ creating Three.js scene ------------------");

        this.dealWithGlobals();
        this.dealWithFog();
        this.dealWithNode(this.data.rootId);
    }

    dealWithGlobals() {
        const globals = this.data.getOptions();
        if (globals == null) return;

        // set background color
        if (globals.background != null) {
            this.app.scene.background = new THREE.Color(globals.background.getHex());
            console.info("Loaded background color");
        }

        // set ambient light
        if (globals.ambient != null) {
            this.app.scene.add(new THREE.AmbientLight(globals.ambient.getHex()));
            console.info("Loaded Ambient light");
        }
    }

    dealWithFog() {
        const fog = this.data.getFog();
        if (fog == null) return;

        // set fog
        const color = fog.color.getHex();
        const near = fog.near;
        const far = fog.far;
        this.app.scene.fog = new THREE.Fog(color, near, far);
        console.info("Loaded Fog");
    }

    dealWithNode(id) {
        const node = this.data.getNode(id);
        if (node == null) return;

        console.info(node);
        if (node.type == "node" && node.children.length > 0) {
            const group = new THREE.Group();
            for (let i = 0; i < node.children.length; i++) {
                // add children to group
                // group.add(this.dealWithNode(node.children[i]));
            }

            // deal with materials

            // deal with transformations

            return group;
        }

        return primitiveRouter(id);
    }
}

export { MyEngine };
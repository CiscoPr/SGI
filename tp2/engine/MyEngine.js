import * as THREE from 'three';
import { MySceneData } from './../parser/MySceneData.js';
import { LightsEngine } from './LightsEngine.js';
import { ComponentsEngine } from './ComponentsEngine.js';

/**
 *  This class contains the contents of our engine
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

    getTexture(id) {
        let texture;
        const params = this.data.getTexture(id);
        
        // load texture
        if (params.isVideo)
            texture = new THREE.VideoTexture().load( params.filepath );
        else
            texture = new THREE.TextureLoader().load( params.filepath );


        return texture;

    getMaterial(id) {
        const matParams = this.data.getMaterial(id);
        const texParams = this.data.getTexture(matParams.textureref);
        if (material == null) return;

        let texture;
        if (texParams.isVideo)
            texture = new THREE.VideoTexture().load( texParams.filepath );
        else
            texture = new THREE.TextureLoader().load( texParams.filepath );


        return material;
    }

    primitiveRouter(id, materialid) {
        const primitive = this.data.getNode(id);
        if (primitive == null) return;

        const lightTypes = ["pointlight", "directionallight", "spotlight"];

        // create switch case for each primitive type
        if (primitive.type == "primitive") {
            const materaial = this.getMaterial(materialid)
            const componentsEngine = new ComponentsEngine(primitive);
            return componentsEngine.buildComponent(material);
        } else if (lightTypes.includes(primitive.type)) {
            const lightEngine = new LightsEngine(primitive);
            return lightEngine.buildLight();
        }

        console.error("Primitive type not found");
        return;
    }

    dealWithNode(id, materialid) {
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

        return primitiveRouter(id, materialid);
    }
}

export { MyEngine };
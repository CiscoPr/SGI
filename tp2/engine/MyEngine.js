import * as THREE from 'three';
import { MySceneData } from './../parser/MySceneData.js';
import { LightsEngine } from './LightsEngine.js';

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
        this.dealWithCameras("cam1");
        this.dealWithCameras("cam2");
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

    primitiveRouter(id) {
        const primitive = this.data.getNode(id);
        if (primitive == null) return;

        const lightTypes = ["pointlight", "directionallight", "spotlight"];

        // create switch case for each primitive type
        if (primitive.type == "primitive") {
            return
        } else if (lightTypes.includes(primitive.type)) {
            const lightEngine = new LightsEngine(primitive);
            return lightEngine.buildLight();
        }

        console.error("Primitive type not found");
        return;
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

    dealWithCameras(id) {
        const camera = this.data.getCamera(id);
        if (camera == null) return;
        const angle = camera.angle;
        const near = camera.near;
        const far = camera.far;
        const location = camera.location;
        const target = camera.target;

        if (camera.type == "perspective") {
            let cam = THREE.PerspectiveCamera(angle, this.app.width / this.app.height, near, far);


        } else if (camera.type == "ortho") {
                        
            const left = camera.left;
            const right = camera.right;
            const top = camera.top;
            const bottom = camera.bottom;
            
            let cam = THREE.OrthographicCamera(left, right, top, bottom, near, far);

        }

        cam.position.set(location.x, location.y, location.z);
        let camTarget = new THREE.Object3D();
        camTarget.position.set(target.x, target.y, target.z);

        
    }
}

export { MyEngine };
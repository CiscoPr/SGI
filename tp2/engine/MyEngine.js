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
        this.dealWithRoot();
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

    dealWithRoot() {
        const root = this.data.getNode(this.data.rootId);
        if (root == null) return;

        console.info(root);
        const rootGroup = this.dealWithNode(root, null);
        console.info(rootGroup);

        this.app.scene.add(rootGroup);
    }

    getTexture(id) {
        if (id == null) return null;
        const params = this.data.getTexture(id);
        if (params == null) return null;

        // load texture
        let texture;
        if (params.isVideo)
            texture = new THREE.VideoTexture().load( params.filepath );
        else
            texture = new THREE.TextureLoader().load( params.filepath );

        texture.generateMipmaps = params.mipmaps;
        texture.anisotropy = params.anisotropy;

        return texture;
    }

    getMaterial(id) {
        if (id == null) return null;
        const params = this.data.getMaterial(id);
        if (params == null) return null;

        // get texture
        const texture = this.getTexture(params.textureref);
        const side = params.twosided ? THREE.DoubleSide : THREE.FrontSide;
        const flatShading = params.shading == "flat" ? true : false;

        // create new mesh phong material
        const material = new THREE.MeshPhongMaterial({
            color: params.color,
            specular: params.specular,
            emissive: params.emissive,
            shininess: params.shininess,
            wireframe: params.wireframe,
            flatShading: flatShading,
            map: texture,
            side: side
        });

        return material;
    }

    dealWithNode(node, materialid) {
        if (node == null) return;

        if (node.type == "node") {
            const group = new THREE.Group();
            for (let i = 0; i < node.children.length; i++) {
                // add children to group
                if (node.materialIds.length == 0)
                    group.add(this.dealWithNode(node.children[i], materialid));
                else
                    group.add(this.dealWithNode(node.children[i], node.materialIds[0]));
            }

            // deal with transformations
            const transformations = node.transformations;
            this.applyTransformations(group, transformations);

            return group;
        }

        return this.primitiveRouter(node, materialid);
    }

    applyTransformations(group, transformations) {
        for (let i = transformations.length - 1; i >= 0; i--) {
            const transformation = transformations[i];
            let currentMatrix = new THREE.Matrix4();
            switch (transformation.type) {
                case "T":
                    const translation = transformation.translate;
                    const translationVector = new THREE.Vector3(translation[0], translation[1], translation[2]);

                    group.applyMatrix4(new THREE.Matrix4().makeTranslation(translationVector));
                    break;
                case "R":
                    const rotation = transformation.rotation;
                    const euler = new THREE.Euler(rotation[0] * Math.PI / 180, rotation[1] * Math.PI / 180, rotation[2] * Math.PI / 180, "XYZ");

                    group.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(euler));
                    break;
                case "S":
                    const scale = transformation.scale;

                    group.applyMatrix4(new THREE.Matrix4().makeScale(scale[0], scale[1], scale[2]));
                    break;
                default:
                    console.error("Transformation type not found");
                    break;
            }
        }
    }


    primitiveRouter(primitive, materialid) {
        if (primitive == null) return;

        const lightTypes = ["pointlight", "directionallight", "spotlight"];

        // create switch case for each primitive type
        if (primitive.type == "primitive") {
            const material = this.getMaterial(materialid)
            const componentsEngine = new ComponentsEngine(primitive);
            return componentsEngine.buildComponent(material);
        } else if (lightTypes.includes(primitive.type)) {
            const lightEngine = new LightsEngine(primitive, this.app);
            return lightEngine.buildLight();
        }

        console.error("Primitive type not found");
        return;
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
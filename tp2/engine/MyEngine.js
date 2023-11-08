import * as THREE from 'three';
import { MySceneData } from './../parser/MySceneData.js';
import { LightsEngine } from './LightsEngine.js';
import { ComponentsEngine } from './ComponentsEngine.js';
import { CamerasEngine } from './CamerasEngine.js';

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
        this.dealWithSkybox();
        this.dealWithFog();
        this.dealWithRoot();
        this.dealWithCameras();

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

    dealWithSkybox() {
        const skybox = this.data.getSkybox();
        if (skybox == null) return;

        //added skybox {"size":[100,100,100],
        //"center": [0, 0, 0], "emissive": 0,
        //"intensity": 10, "up": "scenes/tp2scene/textures/skybox.png",
        //"down": "scenes/tp2scene/textures/skybox.png", "left": "scenes/tp2scene/textures/skybox.png",
        //"right": "scenes/tp2scene/textures/skybox.png", "front": "scenes/tp2scene/textures/skybox.png",
        //"back": "scenes/tp2scene/textures/skybox.png", "type": "skybox", "id": "default", "custom": { }
    
        // set skybox
        const size = skybox.size;
        const center = skybox.center;
        const emissive = skybox.emissive;
        const intensity = skybox.intensity;
        const upTex = skybox.up;
        const downTex = skybox.down;
        const leftTex = skybox.left;
        const rightTex = skybox.right;
        const frontTex = skybox.front;


        const skyboxGeometry = new THREE.BoxGeometry(skybox.size[0], skybox.size[1], skybox.size[2]);
        const skyboxMaterials = [
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(upTex), side: THREE.BackSide, fog:false }),
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(downTex), side: THREE.BackSide, fog:false }),
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(leftTex), side: THREE.BackSide, fog:false }),
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(rightTex), side: THREE.BackSide, fog:false }),
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(frontTex), side: THREE.BackSide, fog:false }),
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(frontTex), side: THREE.BackSide, fog:false }),
        ];



        const skyboxMesh = new THREE.Mesh(skyboxGeometry, skyboxMaterials);
        console.log('my mesh', skyboxMesh)
        skyboxMesh.position.set(center[0], center[1], center[2]);
        this.app.scene.add(skyboxMesh);
        console.info("Loaded Skybox");
    }


    dealWithCameras() {
        const cameras = this.data.getCameras();
        if (cameras == null) return;

        // create switch case for each camera type
        for (let i = 0; i < cameras.length; i++) {
            const cameraEngine = new CamerasEngine(cameras[i]);
            const camera = cameraEngine.buildCamera();
            this.app.cameras.push(camera);
        }

        // set default camera
        this.app.camera = this.app.cameras[0];
        console.info("Loaded Cameras");
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
            side: side,
            transparent: params.transparent,
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


}

export { MyEngine };
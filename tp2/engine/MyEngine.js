import * as THREE from 'three';
import { MySceneData } from './../parser/MySceneData.js';
import { LightsEngine } from './LightsEngine.js';
import { ComponentsEngine } from './ComponentsEngine.js';
import { AuxEngine } from './AuxEngine.js';
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
        this.showBumpTexture = true;
        this.skybox = null;
        this.lights = [];
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


    /**
     * Deals with the global scene options
     * @returns
     */
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

    /**
     * Deals with and sets the fog of the scene
     * @returns
     */
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

    /**
     * Deals with and sets the skybox of the scene
     * @returns
     */
    dealWithSkybox() {
        const skybox = this.data.getSkybox();
        if (skybox == null) return;

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
            new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load(upTex), side: THREE.BackSide, fog:false, emissive: emissive, emissiveIntensity: intensity}),
            new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load(downTex), side: THREE.BackSide, fog:false, emissive: emissive, emissiveIntensity: intensity}),
            new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load(leftTex), side: THREE.BackSide, fog:false, emissive: emissive, emissiveIntensity: intensity }),
            new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load(rightTex), side: THREE.BackSide, fog:false, emissive: emissive, emissiveIntensity: intensity }),
            new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load(frontTex), side: THREE.BackSide, fog:false, emissive: emissive, emissiveIntensity: intensity }),
            new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load(frontTex), side: THREE.BackSide, fog:false, emissive: emissive, emissiveIntensity: intensity }),
        ];

        const skyboxMesh = new THREE.Mesh(skyboxGeometry, skyboxMaterials);
        skyboxMesh.position.set(center[0], center[1], center[2]);
        this.skybox = skyboxMesh;
        this.app.scene.add(skyboxMesh);
        console.info("Loaded Skybox");
    }

    /**
     * With the help of the CamerasEngine, deals with the cameras of the scene
     * @returns
     */
    dealWithCameras() {
        const aspect = window.innerWidth / window.innerHeight;

        const cameras = this.data.cameras;
        if (cameras == null) return;
        // create cameras
        for(let cam in cameras) {
            //if cam is perspective
            if(cameras[cam].type == "perspective") {
                new CamerasEngine(this.app).dealWithPerspective(cameras, cam);
            }
            //if cam is orthogonal
            if(cameras[cam].type == "orthogonal"){
                new CamerasEngine(this.app).dealWithOrthogonal(cameras,cam ,aspect);
            }
        }

        console.info("Loaded Cameras");
    }

    /**
     * Starts the traversal of the scene graph
     * @returns
     */
    dealWithRoot() {
        const root = this.data.getNode(this.data.rootId);
        if (root == null) return;

        console.info(root);
        const rootGroup = this.dealWithNode(root, null);
        console.info(rootGroup);

        this.app.scene.add(rootGroup);
    }

    /**
     * Gets and applies the texture applied to the material
     * @param {String} id
     * @returns
     */
    getTexture(id) {
        if (id == null) return null;
        const params = this.data.getTexture(id);
        if (params == null) return null;

        // load texture
        let texture;
        if (params.isVideo){
            const video = document.getElementById( 'star_save' );
            texture = new THREE.VideoTexture(video);
        }
        else
            texture = new THREE.TextureLoader().load( params.filepath, function (texture){
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        } );

        texture.anisotropy = params.anisotropy;
        texture.generateMipmaps = params.mipmaps

        if (texture.generateMipmaps) {
            texture.minFilter = new AuxEngine().mapMinFilter(params.minfilter);
            texture.magFilter = new AuxEngine().mapMagFilter(params.magfilter);
            return texture;
        }

        // load mipmaps
        let level = 0;
        while (level < 8) {
            let mLevel = "mipmap" + level;
            if (params[mLevel] == null) break;
            new AuxEngine().loadMipmap(texture, level, params[mLevel])
            level++;
        }

        texture.needsUpdate = true;
        return texture;
    }

    /**
     * Gets the material and applies the bumpmap (if it exists)
     * @param {String} id
     * @returns
     */
    getMaterial(id) {
        if (id == null) return null;
        const params = this.data.getMaterial(id);
        if (params == null) return null;
        let bumpMap = null;

        // gets the bump texture if it exists
        if(params.bumpref == null || this.showBumpTexture == false)
            console.log("no bump texture");
        else{
            bumpMap = new THREE.TextureLoader().load(params.bumpref, function (texture){
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            } );
        }
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
            bumpMap: bumpMap,
            bumpScale: params.bumpscale * 1.0,
            flatShading: flatShading,
            map: texture,
            side: side,
            transparent: params.transparent,
        });

        console.log("my material", material);
        return material;
    }

    /**
     * Deals with each node of the tree and its children
     * @param {Object} node
     * @param {String} materialid
     * @returns
     */
    dealWithNode(node, materialid) {
        if (node == null) return;
        if (node.type == "node") {
            const currentNode = this.data.getNode(node.id);
            // create group
            const group = new THREE.Group();
            for (let i = 0; i < node.children.length; i++) {
                // add children to group
                if (node.materialIds.length == 0){
                    //if the parent node has the cast and receive shadows flags set to true, then the children will also have them
                    // otherwise, the children will have the flags set to false
                    if(currentNode.castShadows == true) node.children[i].castShadows = true;
                    if(currentNode.receiveShadows == true) node.children[i].receiveShadows = true;
                    group.add(this.dealWithNode(node.children[i], materialid));
                }
                else{
                    if(currentNode.castShadows == true) node.children[i].castShadows = true;
                    if(currentNode.receiveShadows == true) node.children[i].receiveShadows = true;
                    group.add(this.dealWithNode(node.children[i], node.materialIds[0]));
                }
            }

            // deal with transformations
            const transformations = node.transformations;
            new AuxEngine().applyTransformations(group, transformations);

            return group;
        }

        return this.primitiveRouter(node, materialid);
    }

    /**
     * Deals with each primitive of the tree
     * @param {Object} primitive
     * @param {String} materialid
     * @returns
     */
    primitiveRouter(primitive, materialid) {
        if (primitive == null) return;

        const lightTypes = ["pointlight", "directionallight", "spotlight"];

        // create switch case for each primitive type
        if (primitive.type == "primitive") {
            const material = this.getMaterial(materialid)
            let ts;
            let tt;
            if(material == null) console.log("material is null");
            else {
                ts = this.data.getMaterial(materialid).texlength_s;
                tt = this.data.getMaterial(materialid).texlength_t;
            }
            const componentsEngine = new ComponentsEngine(primitive);
            return componentsEngine.buildComponent(this.app, material, ts, tt);
        } else if (lightTypes.includes(primitive.type)) {
            const lightEngine = new LightsEngine(primitive, this.app);
            this.lights.push(lightEngine.buildLight());
            return lightEngine.buildLight();
        }

        console.error("Primitive type not found");
        return;
    }

    /**
     * removes or adds the skybox to the scene
     * @param {String} value
     */
    updateSkybox(value){
        if(value === 'off'){
            console.log("removed skybox");
            // this is the current index of the skybox
            this.app.scene.children[1] = new THREE.Object3D();

        }
        else{
            console.log("added skybox");
            this.app.scene.children[1] = this.skybox;
        }

    }


    updateLights(value){
        console.log("materials: ",this.app.scene.children[2].children);
        if(value === 'off'){
            console.log("Removed scene lights")
            // this is the current index of the lights
            this.app.scene.children[2].children = this.app.scene.children[2].children.slice(0, -3);
            console.log("materials: ",this.app.scene.children[2].children);
        }else{
            console.log("Added scene lights")
            for(let i = 0; i < this.lights.length; i++)
            this.app.scene.children[2].children.push(this.lights[i]);
        }

    }

}

export { MyEngine };
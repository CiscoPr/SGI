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
        this.showBumpTexture = true;
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
            new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load(upTex), side: THREE.BackSide, fog:false, emissive: emissive, emissiveIntensity: intensity}),
            new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load(downTex), side: THREE.BackSide, fog:false, emissive: emissive, emissiveIntensity: intensity}),
            new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load(leftTex), side: THREE.BackSide, fog:false, emissive: emissive, emissiveIntensity: intensity }),
            new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load(rightTex), side: THREE.BackSide, fog:false, emissive: emissive, emissiveIntensity: intensity }),
            new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load(frontTex), side: THREE.BackSide, fog:false, emissive: emissive, emissiveIntensity: intensity }),
            new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load(frontTex), side: THREE.BackSide, fog:false, emissive: emissive, emissiveIntensity: intensity }),
        ];

        const skyboxMesh = new THREE.Mesh(skyboxGeometry, skyboxMaterials);
        skyboxMesh.position.set(center[0], center[1], center[2]);
        this.app.scene.add(skyboxMesh);
        console.info("Loaded Skybox");
    }


    dealWithCameras() {
        const aspect = window.innerWidth / window.innerHeight;

        const cameras = this.data.cameras;
        if (cameras == null) return;
        // create cameras
        for(let cam in cameras) {
            //if cam is perspective
            if(cameras[cam].type == "perspective") {
                const camera = new THREE.PerspectiveCamera(cameras[cam].fov, cameras[cam].an,cameras[cam].near, cameras[cam].far);
                camera.position.set(cameras[cam].location[0], cameras[cam].location[1], cameras[cam].location[2]);
                camera.lookAt(cameras[cam].target[0], cameras[cam].target[1], cameras[cam].target[2]);
                this.app.cameras['Perspective'] = camera;
            }
            //if cam is orthogonal
            if(cameras[cam].type == "orthogonal"){
                this.dealWithOrthogonal(cameras,cam ,aspect);
            }


        }


        console.info("Loaded Cameras");
    }



    dealWithOrthogonal(cameras,cam, aspect) {
        const left = - cameras[cam].left / 2 * aspect
        const right = cameras[cam].right /2 * aspect
        const top = cameras[cam].top / 2
        const bottom = -cameras[cam].bottom / 2
        const near = -cameras[cam].near /2
        const far =  cameras[cam].far
        const cameraLeft = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
        const cameraRight = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
        const cameraTop = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
        const cameraBottom = new THREE.OrthographicCamera(left, right, top, bottom, near, far);

        cameraLeft.up = new THREE.Vector3(0,1,0);
        cameraLeft.position.set(-cameras[cam].location[0] /4,0,0);
        cameraLeft.lookAt( cameras[cam].target);
        this.app.cameras['Left'] = cameraLeft;

        cameraRight.up = new THREE.Vector3(0,1,0);
        cameraRight.position.set(cameras[cam].location[0] /4,0,0);
        cameraRight.lookAt( cameras[cam].target );
        this.app.cameras['Right'] = cameraRight;

        cameraTop.up = new THREE.Vector3(0,0,1);
        cameraTop.position.set(0, cameras[cam].location[1] /4, 0);
        cameraTop.lookAt(cameras[cam].target);
        this.app.cameras['Top'] = cameraTop;

        cameraBottom.up = new THREE.Vector3(0,0,1);
        cameraBottom.position.set(0, -cameras[cam].location[1] /4, 0);
        cameraBottom.lookAt( cameras[cam].target );
        this.app.cameras['Bottom'] = cameraBottom;
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
            texture.minFilter = this.mapMinFilter(params.minfilter);
            texture.magFilter = this.mapMagFilter(params.magfilter);
            return texture;
        }

        // load mipmaps
        let level = 0;
        while (level < 8) {
            let mLevel = "mipmap" + level;
            if (params[mLevel] == null) break;
            this.loadMipmap(texture, level, params[mLevel])
            level++;
        }

        texture.needsUpdate = true;
        return texture;
    }

    getMaterial(id) {
        if (id == null) return null;
        const params = this.data.getMaterial(id);
        if (params == null) return null;
        let bumpMap = null;
        // check if the Show Bump of the GUI is on or off
        // get texture
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


        return material;
    }

    dealWithNode(node, materialid) {
        if (node == null) return;
        if (node.type == "node") {
            const currentNode = this.data.getNode(node.id);
            // create group
            const group = new THREE.Group();
            for (let i = 0; i < node.children.length; i++) {
                // add children to group
                if (node.materialIds.length == 0){
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
            const ts = this.data.getMaterial(materialid).texlength_s;
            const tt = this.data.getMaterial(materialid).texlength_t;
            const componentsEngine = new ComponentsEngine(primitive);
            return componentsEngine.buildComponent(material, ts, tt);
        } else if (lightTypes.includes(primitive.type)) {
            const lightEngine = new LightsEngine(primitive, this.app);
            return lightEngine.buildLight();
        }

        console.error("Primitive type not found");
        return;
    }

    mapMinFilter(str) {
        switch (str) {
          case "NearestFilter":
              return THREE.NearestFilter;
          case "NearestMipmapNearestFilter":
              return THREE.NearestMipmapNearestFilter;
          case "NearestMipmapLinearFilter":
              return THREE.NearestMipmapLinearFilter;
          case "LinearFilter":
              return THREE.LinearFilter;
          case "LinearMipmapNearestFilter":
              return THREE.LinearMipmapNearestFilter;
          default:
            return THREE.LinearMipmapLinearFilter;
        }
    }

    mapMagFilter(str) {
        if (str == "NearestFilter") return THREE.NearestFilter;
        else return THREE.LinearFilter;
    }

    /**
     * load an image and create a mipmap to be added to a texture at the defined level.
     * In between, add the image some text and control squares. These items become part of the picture
     *
     * @param {*} parentTexture the texture to which the mipmap is added
     * @param {*} level the level of the mipmap
     * @param {*} path the path for the mipmap image
     */
    loadMipmap(parentTexture, level, path)
    {
        // load texture. On loaded call the function to create the mipmap for the specified level
        new THREE.TextureLoader().load(path,
            function(mipmapTexture)  // onLoad callback
            {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                ctx.scale(1, 1);

                const img = mipmapTexture.image
                canvas.width = img.width;
                canvas.height = img.height

                // first draw the image
                ctx.drawImage(img, 0, 0 )

                // set the mipmap image in the parent texture in the appropriate level
                parentTexture.mipmaps[level] = canvas
            },
            undefined, // onProgress callback currently not supported
            function(err) {
                console.error('Unable to load the image ' + path + ' as mipmap level ' + level + ".", err)
            }
        )
    }

    updateShowBumpTexture(value){

    }
}

export { MyEngine };
import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';

/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app
        this.axis = null

        // table related attributes
        this.tableMesh = null

        // plate related attributes
        this.plateMesh = null

        // plane related attributes

        //texture

        this.planeTexture =
            new THREE.TextureLoader().load('textures/feup_b.jpg');

        // the wrapS must be equals to the one selected in the gui interface
        this.planeTexture.wrapS = THREE.RepeatWrapping;

        this.planeTexture.wrapT = THREE.RepeatWrapping;


        // material

         this.diffusePlaneColor =  "rgb(128,0,0)"

         this.specularPlaneColor = "rgb(0,0,0)"

         this.planeShininess = 0


        // relating texture and material:

        // two alternatives with different results


        // alternative 1
        /*
         this.planeMaterial = new THREE.MeshPhongMaterial({

            color: this.diffusePlaneColor,

            specular: this.specularPlaneColor,

            emissive: "#000000", shininess: this.planeShininess,

            map: this.planeTexture })

        // end of alternative 1*/


        // alternative 2

        this.planeMaterial = new THREE.MeshLambertMaterial({

            map : this.planeTexture });

        // end of alternative 2


        let plane = new THREE.PlaneGeometry( 10, 3 );

        // cake related attributes
        this.cakeMesh = null

        // candle related attributes
        this.candleMesh = null

        // walls related attributes
        this.walls = null

        // spotLight related attributes
        this.spotLight = null
        this.spotLightTarget = null
        this.spotLightHelper = null
    }

    buildBox() {
        this.cubeTexture =
            new THREE.TextureLoader().load('textures/feup_entry.jpg');

        this.cubeTexture.wrapS = THREE.RepeatWrapping;

        this.cubeTexture.wrapT = THREE.RepeatWrapping;


        this.diffuseCubeColor =  "rgb(128,128,128)"

        this.specularCubeColor = "rgb(0,0,0)"

        this.cubeShininess = 0

        let boxMaterial = new THREE.MeshPhongMaterial({
            color: this.diffuseCubeColor,

            specular: this.specularCubeColor,

            emissive: "#000000", shininess: this.cubeShininess,

            map: this.cubeTexture
         })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(  this.boxMeshSize,  this.boxMeshSize,  this.boxMeshSize );
        this.boxMesh = new THREE.Mesh( box, boxMaterial );
        this.boxMesh.position.y =  5;
        this.app.scene.add( this.boxMesh );
    }


    /**
     * builds the table mesh with material assigned
     */
    buildTable() {
        this.tableTexture = new THREE.TextureLoader().load('textures/wood.jpg');
        // legs must be of specular color
        this.legSpecularColor = "rgb(128, 128, 128)"

        this.legDiffuseColor = "rgb(0, 0, 0)"

        this.legShininess = 90

        let legMaterial = new THREE.MeshPhongMaterial({ color: this.legDiffuseColor,

            specular: this.legSpecularColor,

            emissive: "#000000", shininess: this.legShininess });

        let tableMaterial = new THREE.MeshPhongMaterial({ color: "#684500",
        specular: "#000000", emissive: "#000000", shininess: 90 , map: this.tableTexture});

        // Create a table Mesh with basic material
        let table = new THREE.BoxGeometry( 1.5, 2.0, 0.1);
        this.tableMesh = new THREE.Mesh( table, tableMaterial );

        // Create each leg Mesh with basic material
        const leg = new THREE.CylinderGeometry( 0.1, 0.1, 1, 8);
        for (let i = 0; i < 4; i++) {
            let legMesh = new THREE.Mesh( leg, legMaterial );
            legMesh.rotation.x = -Math.PI / 2;
            legMesh.position.x = (i % 2) ? -0.6 : 0.6;
            legMesh.position.y = (i < 2) ? -0.8 : 0.8;
            legMesh.position.z = -0.5;

            this.tableMesh.add(legMesh);
        }

        // adjust the table position
        this.tableMesh.rotation.x = -Math.PI / 2;

        // add the table to the scene
        this.app.scene.add( this.tableMesh );
    }

    buildPlate() {
        let plateMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff",
        specular: "#000000", emissive: "#000000", shininess: 90 });

        // build the plate mesh
        let plateGeometry = new THREE.CylinderGeometry( 0.35, 0.25, 0.1);
        this.plateMesh = new THREE.Mesh( plateGeometry, plateMaterial );

        // add plate to the scene
        this.app.scene.add( this.plateMesh );
    }

    /**
     * builds the cake cylinder with a triangular piece missing
     */

    buildCake() {
        let cakeMaterial = new THREE.MeshPhongMaterial({ color: "#63452c",
            specular: "#cdab8f", emissive: "#000000", shininess: 90 });

        // build the cake mesh
        let cake = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32, 1, false, 0, 7*Math.PI/4);
        this.cakeMesh = new THREE.Mesh(cake, cakeMaterial);

        // create child geometry
        let plane = new THREE.PlaneGeometry(0.2, 0.6);

        let planeMesh1 = new THREE.Mesh(plane, cakeMaterial);
        planeMesh1.rotation.z = Math.PI / 2;
        planeMesh1.rotation.y = Math.PI / 4;

        let planeMesh2 = new THREE.Mesh(plane, cakeMaterial);
        planeMesh2.rotation.z = Math.PI / 2;
        planeMesh2.rotation.y = -Math.PI / 2;

        // add plane to the cake mesh
        this.cakeMesh.add(planeMesh1);
        this.cakeMesh.add(planeMesh2);

        // add the cake to the scene
        this.app.scene.add(this.cakeMesh);
    }

    /**
     * builds the candle with is a cylinder
     */
    buildCandle() {
        let flameMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77",
        specular: "#ff0000", emissive: "#ff0000", shininess: 90 });

        let wickMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff",
        specular: "#ff0000", emissive: "#ffffff", shininess: 90 });

        let candleMaterial = new THREE.MeshPhongMaterial({ color: "#8ac6ff",
        specular: "#000000", emissive: "#8ac6ff", shininess: 90 });

        // build the flame mesh
        let flame = new THREE.CapsuleGeometry( 0.016, 0.026);
        let flameMesh = new THREE.Mesh(flame, flameMaterial);
        flameMesh.position.y = 0.05;

        // build the wick mesh
        let wick = new THREE.CylinderGeometry( 0.005, 0.005, 0.13);
        let wickMesh = new THREE.Mesh(wick, wickMaterial);

        // add flame to the wick
        wickMesh.add(flameMesh);

        // adjust the wick position
        wickMesh.position.y = 0.16;

        // build the candle mesh
        let candle = new THREE.CylinderGeometry( 0.016, 0.016, 0.3);
        this.candleMesh = new THREE.Mesh(candle, candleMaterial);

        // add wick to the candle
        this.candleMesh.add(wickMesh);

        // add flameMesh to the scene
        this.app.scene.add(this.candleMesh);
    }

    /**
     * builds the walls group
     */
    buildWalls() {

        this.wallDiffuseColor = "rgb(154,153,150)"

        //wall must not have specular component
        this.wallSpecularColor = "rgb(0,0,0)"

        this.wallShininess = 0



        let planeMaterial = new THREE.MeshPhongMaterial({
            color: this.wallDiffuseColor,

            specular: this.wallSpecularColor,

            emissive: "#000000", shininess: this.wallShininess})

        let plane1 = new THREE.PlaneGeometry(10, 10);
        let planeMesh1 = new THREE.Mesh(plane1, planeMaterial);
        planeMesh1.rotation.y = Math.PI;
        planeMesh1.position.y = 5;
        planeMesh1.position.z = 5;


        let plane2 = new THREE.PlaneGeometry(10, 10);
        let planeMesh2 = new THREE.Mesh(plane2, planeMaterial);
        planeMesh2.rotation.y = Math.PI / 2;
        planeMesh2.position.y = 5;
        planeMesh2.position.x = -5;


        let plane3 = new THREE.PlaneGeometry(10, 10);
        let planeMesh3 = new THREE.Mesh(plane3, planeMaterial);
        planeMesh3.position.y = 5;
        planeMesh3.position.z = -5;

        let plane4 = new THREE.PlaneGeometry(10, 10);
        let planeMesh4 = new THREE.Mesh(plane4, planeMaterial);
        planeMesh4.rotation.y = -Math.PI / 2;
        planeMesh4.position.y = 5;
        planeMesh4.position.x = 5;

        this.walls = new THREE.Group();
        this.walls.add(planeMesh1);
        this.walls.add(planeMesh2);
        this.walls.add(planeMesh3);
        this.walls.add(planeMesh4);

        this.app.scene.add(this.walls);
    }

    buildPicture(tex) {
        /* idea of picture border
        let borderUpper = new THREE.BoxGeometry( 1.5, 0.1, 0.1);
        let borderLower = new THREE.BoxGeometry( 1.5, 0.1, 0.1);
        let borderLeft = new THREE.BoxGeometry( 0.1, 1.5, 0.1);
        let borderRight = new THREE.BoxGeometry( 0.1, 1.5, 0.1);

        let borderMaterial = new THREE.MeshPhongMaterial({ color: "#000000",
        specular: "#000000", emissive: "#000000", shininess: 90 });

        let borderMeshUpper = new THREE.Mesh( borderUpper, borderMaterial );
        let borderMeshLower = new THREE.Mesh( borderLower, borderMaterial );
        let borderMeshLeft = new THREE.Mesh( borderLeft, borderMaterial );
        let borderMeshRight = new THREE.Mesh( borderRight, borderMaterial );

        borderMeshUpper.position.y = 5;
        borderMeshUpper.position.z = -5;


        borderMeshLower.position.y = 4.25;
        borderMeshLeft.position.x = -0.75;
        borderMeshRight.position.x = 0.75;

        this.app.scene.add( borderMeshUpper );
        this.app.scene.add( borderMeshLower );
        this.app.scene.add( borderMeshLeft );
        this.app.scene.add( borderMeshRight );
        */

        this.pictureTexture = new THREE.TextureLoader().load('textures/'+ tex);


        this.pictureTexture.wrapS = THREE.RepeatWrapping;

        this.pictureTexture.wrapT = THREE.RepeatWrapping;


        this.diffusePictureColor =  "rgb(128,128,128)"

        this.specularPictureColor = "rgb(0,0,0)"

        this.pictureShininess = 0

        let pictureMaterial = new THREE.MeshPhongMaterial({
            color: this.diffusePictureColor,

            specular: this.specularPictureColor,

            emissive: "#000000", shininess: this.pictureShininess,

            map: this.pictureTexture })

        this.pictureWidth = 1;
        this.pictureHeight = 1.5;

        let picture = new THREE.PlaneGeometry( this.pictureWidth, this.pictureHeight );

        this.pictureMesh = new THREE.Mesh( picture, pictureMaterial );

        this.pictureMesh.position.y = 5;

        this.pictureMesh.position.z = -4.9;

        if(tex == '202004646.jpg')
            this.pictureMesh.position.x = 1.5;

        else
            this.pictureMesh.position.x = -1.5;

        this.app.scene.add( this.pictureMesh );



    }

    //here's a nice reference :)
    buildWindows() {

        //loads the texture
        let windowTexture = new THREE.TextureLoader().load('textures/nostalgia.jpg');

        windowTexture.wrapS = THREE.RepeatWrapping;

        windowTexture.wrapT = THREE.RepeatWrapping;


        let windowMaterial = new THREE.MeshPhongMaterial({
            color: "#ffffff",

            specular: "#000000",

            emissive: "#000000", shininess: 90,

            map: windowTexture })

        let windowWidth = 5;
        let windowHeight = 2.5;

        let window = new THREE.PlaneGeometry( windowWidth, windowHeight );

        this.windowMesh = new THREE.Mesh( window, windowMaterial );

        this.windowMesh.rotation.y = Math.PI / 2;

        this.windowMesh.position.y = 5;

        this.windowMesh.position.x = -4.9;

        //window border
        let borderUpper = new THREE.BoxGeometry( windowWidth, 0.1, 0.1);
        let borderLower = new THREE.BoxGeometry( windowWidth, 0.1, 0.1);
        let borderLeft = new THREE.BoxGeometry( 0.1, windowHeight, 0.1);
        let borderRight = new THREE.BoxGeometry( 0.1, windowHeight, 0.1);
        let borderMiddle = new THREE.BoxGeometry( 0.1, windowHeight, 0.1);

        let borderMaterial = new THREE.MeshPhongMaterial({ color: "#000000",
        specular: "#000000", emissive: "#000000", shininess: 90 });

        let borderMeshUpper = new THREE.Mesh( borderUpper, borderMaterial );
        let borderMeshLower = new THREE.Mesh( borderLower, borderMaterial );
        let borderMeshLeft = new THREE.Mesh( borderLeft, borderMaterial );
        let borderMeshRight = new THREE.Mesh( borderRight, borderMaterial );
        let borderMeshMiddle = new THREE.Mesh( borderMiddle, borderMaterial );

        //defines the position of the borders
        borderMeshUpper.rotation.y = Math.PI / 2;
        borderMeshUpper.position.y = 5 + windowHeight / 2;
        borderMeshUpper.position.x = -4.9;

        borderMeshLower.rotation.y = Math.PI / 2;
        borderMeshLower.position.y = 5 - windowHeight / 2;
        borderMeshLower.position.x = -4.9;

        borderMeshMiddle.position.y = 5;
        borderMeshMiddle.position.x = -4.9;

        borderMeshLeft.position.y = 5;
        borderMeshLeft.position.x = -4.9;
        borderMeshLeft.position.z = -windowWidth/2 + 0.05;

        borderMeshRight.position.y = 5;
        borderMeshRight.position.x = -4.9;
        borderMeshRight.position.z = windowWidth/2 - 0.05;

        //adds the borders to the scene
        this.app.scene.add( borderMeshUpper );
        this.app.scene.add( borderMeshLower );
        this.app.scene.add( borderMeshMiddle );
        this.app.scene.add( borderMeshLeft );
        this.app.scene.add( borderMeshRight );

        //adds the window to the scene
        this.app.scene.add( this.windowMesh );
    }

    buildKirby(){
        //loads the texture
        let kirbyTexture = new THREE.TextureLoader().load('textures/kirby.jpg');

        kirbyTexture.wrapS = THREE.RepeatWrapping;

        kirbyTexture.wrapT = THREE.RepeatWrapping;

        let kirbyMaterial = new THREE.MeshPhongMaterial({
            color: "#ffffff",

            specular: "#000000",

            emissive: "#000000", shininess: 90,

            map: kirbyTexture })

        let kirbyHandsMaterial = new THREE.MeshPhongMaterial({
            color: "#d5afaf",

            specular: "#000000",

            emissive: "#000000", shininess: 90})

        let kirbyFeetMaterial = new THREE.MeshPhongMaterial({
            color: "#800051",

            specular: "#000000",

            emissive: "#000000", shininess: 90})

        let kirby = new THREE.SphereGeometry(1, 32, 32);
        let kirbyHands = new THREE.SphereGeometry(0.3, 32, 32);
        let kirbyFeet = new THREE.CylinderGeometry(0.4, 0.5, 0.3, 32);

        this.kirbyMesh = new THREE.Mesh( kirby, kirbyMaterial );

        this.kirbyMesh.position.y = 1;

        this.kirbyMesh.position.x = 3;

        let rightHand = new THREE.Mesh( kirbyHands, kirbyHandsMaterial );
        rightHand.position.y = 0.7;
        rightHand.position.x = 3;
        rightHand.position.z = 0.9;

        let leftHand = new THREE.Mesh( kirbyHands, kirbyHandsMaterial );
        leftHand.position.y = 0.7;
        leftHand.position.x = 3;
        leftHand.position.z = -0.9;

        let rightFoot = new THREE.Mesh( kirbyFeet, kirbyFeetMaterial );
        rightFoot.position.y = 0.1;
        rightFoot.position.x = 3;
        rightFoot.position.z = 0.65;
                                                                                                                                                                                                                                                                                                                                                                               ;

        let leftFoot = new THREE.Mesh( kirbyFeet, kirbyFeetMaterial );
        leftFoot.position.y = 0.1;
        leftFoot.position.x = 3;
        leftFoot.position.z = -0.65;


        let kirbyGroup = new THREE.Group();
        kirbyGroup.add(this.kirbyMesh);
        kirbyGroup.add(rightHand);
        kirbyGroup.add(leftHand);
        kirbyGroup.add(rightFoot);
        kirbyGroup.add(leftFoot);

        this.app.scene.add( kirbyGroup );



    }

    /**
     * initializes the contents
     */
    init() {

        // create once
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }

        //-------------------------------------------------------------------------------

        // add a point light on top of the model
        const pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
        pointLight.position.set( 0, 20, 0 );
        this.app.scene.add( pointLight );
        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

        //-------------------------------------------------------------------------------

        // add a spot light on top of the model
        this.spotLight = new THREE.SpotLight( 0xffffff, 4, 0.6, Math.PI/180 * 35, 0, 0 );
        this.spotLight.position.set( 0.3, 1.55, -0.3 );
        this.app.scene.add( this.spotLight );
        // add a target for the previous spot light
        this.spotLightTarget = new THREE.Object3D();
        this.spotLightTarget.position.set( 0, 1.3, 0 );
        this.app.scene.add( this.spotLight.target );
        this.app.scene.add( this.spotLightTarget );
        this.spotLight.target = this.spotLightTarget;
        // add a spot light helper for the previous spot light
        //this.spotLightHelper = new THREE.SpotLightHelper( this.spotLight );
        //this.app.scene.add( this.spotLightHelper );

        //--------------------------------------------------------------------------------

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( ambientLight );

        //--------------------------------------------------------------------------------

        this.updatePlaneTexture('ClampToEdgeWrapping');
        // build objects
        this.buildWalls();
        this.buildTable();
        this.buildPlate();
        this.buildCake();
        this.buildCandle();
        this.buildBox();
        this.buildPicture('202004646.jpg');
        this.buildPicture('202004724.jpg');
        this.buildWindows();
        this.buildKirby();

        // adjust the table position
        this.tableMesh.position.y += 1;

        // adjust the plate position
        this.plateMesh.position.y = 1.1;

        // adjust the cake position
        this.cakeMesh.position.y = 1.2;

        // adjust the candle position
        this.candleMesh.position.y = 1.3;
        this.candleMesh.position.x = 0.1;
        this.candleMesh.position.z = -0.1;


        // Create a Plane Mesh with basic material

        let planeSizeU = 10;

        let planeSizeV = 7;

        let planeUVRate = planeSizeV / planeSizeU;


        let planeTextureUVRate = 3354 / 2385; // image dimensions

        let planeTextureRepeatU = 1;

        let planeTextureRepeatV =

            planeTextureRepeatU * planeUVRate * planeTextureUVRate;

        this.planeTexture.repeat.set(

            planeTextureRepeatU, planeTextureRepeatV );

        this.planeTexture.rotation = 0;

        this.planeTexture.offset = new THREE.Vector2(0,0);


        var plane = new THREE.PlaneGeometry( planeSizeU, planeSizeV );

        this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );

        this.planeMesh.rotation.x = -Math.PI / 2;

        this.planeMesh.position.y = 0;

        this.app.scene.add( this.planeMesh );
    }

    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }

    updatePlaneTexture(value){

        if (value == 'ClampToEdgeWrapping') {
            this.planeTexture.wrapS = THREE.ClampToEdgeWrapping;
        }
        else if (value == 'RepeatWrapping') {
            this.planeTexture.wrapS = THREE.RepeatWrapping;
        }
        else if (value == 'MirroredRepeatWrapping') {
            this.planeTexture.wrapS = THREE.MirroredRepeatWrapping;
        }
        this.planeMaterial.needsUpdate = true;
    }

    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    /* rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {
            this.app.scene.remove(this.boxMesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    } */

    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    /* updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh)
            }
            else {
                this.app.scene.remove(this.boxMesh)
            }
        }
    } */

    /**
     * updates the contents
     * this method is called from the render method of the app
     *
     */
    update() {
        // check if box mesh needs to be updated
        // this.updateBoxIfRequired()

        // sets the box mesh position based on the displacement vector
        /* this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z */

    }

}

export { MyContents };
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

         this.planeTexture.wrapS = THREE.RepeatWrapping;

         this.planeTexture.wrapT = THREE.RepeatWrapping;


                 // material

         this.diffusePlaneColor =  "rgb(128,128,128)"

         this.specularPlaneColor = "rgb(0,0,0)"

         this.planeShininess = 0


                 // relating texture and material:

                     // two alternatives with different results


                         // alternative 1

         this.planeMaterial = new THREE.MeshPhongMaterial({

            color: this.diffusePlaneColor,

            specular: this.specularPlaneColor,

            emissive: "#000000", shininess: this.planeShininess,

            map: this.planeTexture })

            // end of alternative 1


            // alternative 2

            // this.planeMaterial = new THREE.MeshLambertMaterial({

            // map : this.planeTexture });

            // end of alternative 2


            let plane = new THREE.PlaneGeometry( 10, 10 );

        // cake related attributes
        this.cakeMesh = null

        // candle related attributes
        this.candleMesh = null

        // walls related attributes
        this.walls = null
    }

    /**
     * builds the table mesh with material assigned
     */
    buildTable() {
        let tableMaterial = new THREE.MeshPhongMaterial({ color: "#684303",
        specular: "#000000", emissive: "#000000", shininess: 90 });

        // Create a table Mesh with basic material
        let table = new THREE.BoxGeometry( 1.5, 2.0, 0.1);
        this.tableMesh = new THREE.Mesh( table, tableMaterial );

        // Create each leg Mesh with basic material
        const leg = new THREE.CylinderGeometry( 0.1, 0.1, 1, 8);
        for (let i = 0; i < 4; i++) {
            let legMesh = new THREE.Mesh( leg, tableMaterial );
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
         // wall related attributes
         let planeMaterial = new THREE.MeshPhongMaterial({ color: "#9a9996",
             specular: "#ffffff", emissive: "#000000", shininess: 30 })

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

        // add a point light on top of the model
        const pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
        pointLight.position.set( 0, 20, 0 );
        this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( ambientLight );

        // build objects scenario
        this.buildWalls();
        this.buildTable();
        this.buildPlate();
        this.buildCake();
        this.buildCandle();

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

        let plane = new THREE.PlaneGeometry( 10, 10 );
        this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -0;
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
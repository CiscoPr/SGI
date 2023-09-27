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
        this.plateMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
        specular: "#000000", emissive: "#000000", shininess: 90 })


        // plane related attributes
        this.diffusePlaneColor = "#00ffff"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.diffusePlaneColor, emissive: "#000000", shininess: this.planeShininess
        })
        
        // cake related attributes
        this.cakeMesh = null
        this.cakeMeshSize = 1.0
        this.cakeEnabled = true
        this.lastCakeEnabled = null
        this.cakeDisplacement = new THREE.Vector3(0, 1, 0)

        // candle related attributes
        this.candleMesh = null
        this.candleMeshSize = 1.0
        this.candleMeshRadius = 0.1
        this.candleEnabled = true
        this.lastCandleEnabled = null
        this.candleDisplacement = new THREE.Vector3(0, 2, 0)

        // plane related attributes
        this.diffusePlaneColor = "#9a9996"
        this.specularPlaneColor = "#ffffff"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.diffusePlaneColor, emissive: "#000000", shininess: this.planeShininess })
    }

    /**
     * builds the table mesh with material assigned
     */
    buildTable() {    
        let tableMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
        specular: "#000000", emissive: "#000000", shininess: 90 })

        let legMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77",
        specular: "#000000", emissive: "#000000", shininess: 90 })

        // Create a table Mesh with basic material
        let table = new THREE.BoxGeometry( 1, 1.5, 0.1);
        this.tableMesh = new THREE.Mesh( table, tableMaterial );

        // Create each leg Mesh with basic material
        const leg = new THREE.CylinderGeometry( 0.1, 0.1, 1, 8);
        for (let i = 0; i < 4; i++) {
            let legMesh = new THREE.Mesh( leg, legMaterial );
            legMesh.rotation.x = -Math.PI / 2;
            legMesh.position.x = (i % 2) ? -0.4 : 0.4;
            legMesh.position.y = (i < 2) ? -0.6 : 0.6;
            legMesh.position.z = -0.5;

            this.tableMesh.add(legMesh);
        }

        // adjust the table position
        this.tableMesh.rotation.x = -Math.PI / 2;

        // add the table to the scene
        this.app.scene.add( this.tableMesh );
    }

    buildPlate() {
        // build the plate mesh
        let plateGeometry = new THREE.CylinderGeometry( 0.2, 0.4, 0.3);
        this.plateMesh = new THREE.Mesh( plateGeometry, this.plateMaterial );
        this.plateMesh.rotation.x = -Math.PI;
        this.app.scene.add( this.plateMesh );
    }

    /**
     * builds the cake cylinder with a triangular piece missing
     */

    buildCake() {
        let cakeMaterial = new THREE.MeshPhongMaterial({
            color: "#63452c",
            specular: "#cdab8f",
            emissive: "#000000",
            shininess: 90
        })

        let cake = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32, 1, false, 0, 3*Math.PI/2);
        this.cakeMesh = new THREE.Mesh(cake, cakeMaterial);
        //this.cakeMesh.position.y = ;
        this.app.scene.add(this.cakeMesh);

    }

    /**
     * builds the candle with is a cylinder
     */
    buildCandle() {
        let candleMaterial = new THREE.MeshPhongMaterial({
            color: "#9a9996",
            specular: "#ffffff",
            emissive: "#000000",
            shininess: 90
        })

        let candle = new THREE.CylinderGeometry(this.candleMeshRadius, this.candleMeshRadius, this.candleMeshSize);
        this.candleMesh = new THREE.Mesh(candle, candleMaterial);
        this.candleMesh.position.y = this.candleDisplacement.y;
        this.app.scene.add(this.candleMesh);
    }

    /**
     * builds the walls group
     */
    buildWalls() {
        let plane2 = new THREE.PlaneGeometry(10, 10);
        this.planeMesh2 = new THREE.Mesh(plane2, this.planeMaterial);
        this.planeMesh2.rotation.y = Math.PI;
        this.planeMesh2.position.y = 5;
        this.planeMesh2.position.z = 5;
        

        let plane3 = new THREE.PlaneGeometry(10, 10);
        this.planeMesh3 = new THREE.Mesh(plane3, this.planeMaterial);
        this.planeMesh3.rotation.y = Math.PI / 2;
        this.planeMesh3.position.y = 5;
        this.planeMesh3.position.x = -5;


        let plane4 = new THREE.PlaneGeometry(10, 10);
        this.planeMesh4 = new THREE.Mesh(plane4, this.planeMaterial);
        this.planeMesh4.rotation.y = Math.PI;
        this.planeMesh4.position.y = 5;
        this.planeMesh4.position.z = -5;

        let plane5 = new THREE.PlaneGeometry(10, 10);
        this.planeMesh5 = new THREE.Mesh(plane5, this.planeMaterial);
        this.planeMesh5.rotation.y = Math.PI / 2;
        this.planeMesh5.position.y = 5;
        this.planeMesh5.position.x = 5;

        const walls = new THREE.Group();
        walls.add(this.planeMesh2);
        walls.add(this.planeMesh3);
        walls.add(this.planeMesh4);
        walls.add(this.planeMesh5);

        this.app.scene.add(walls);
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
        this.buildTable();
        this.buildPlate();
        this.buildWalls();
        this.buildCake();
        this.buildCandle();

        // adjust the table position
        this.tableMesh.position.y += 1;

        // adjust the plate position
        this.plateMesh.position.y = 1.1;

        
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
        //this.updateBoxIfRequired()

        // sets the box mesh position based on the displacement vector
        /* this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z */
        
    }

}

export { MyContents };
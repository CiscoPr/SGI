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
        this.LegsMesh = new Array(4)

        // plate related attributes
        this.plateMesh = null
        this.plateMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
        specular: "#000000", emissive: "#000000", shininess: 90 })


        // plane related attributes
        this.diffusePlaneColor = "#00ffff"
        this.specularPlaneColor = "#777777"
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
        this.tableMesh.rotation.x = -Math.PI / 2;

        // add the table to the scene
        this.app.scene.add( this.tableMesh );

        // Create each leg Mesh with basic material
        let leg = new THREE.CylinderGeometry( 0.1, 0.1, 1, 8);
        for (let i = 0; i < 4; i++) {
            this.LegsMesh[i] = new THREE.Mesh( leg, legMaterial ); 
            this.LegsMesh[i].position.x = (i % 2) ? -0.4 : 0.4;
            this.LegsMesh[i].position.z = (i < 2) ? -0.6 : 0.6;
            this.LegsMesh[i].position.y = -0.5;

            // add each leg(child) to the table(parent)
            this.tableMesh.add(this.LegsMesh[i]);

            // add each leg to the scene
            this.app.scene.add(this.LegsMesh[i]);
        } 
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

        // build the table mesh
        this.buildTable();
        // adjust the table position
        this.tableMesh.position.y += 1;
        for (let i = 0; i < this.LegsMesh.length; i++) {
            this.LegsMesh[i].position.y += 1
        }

        // build the plate mesh
        let plateGeometry = new THREE.CylinderGeometry( 0.2, 0.4, 0.3);
        this.plateMesh = new THREE.Mesh( plateGeometry, this.plateMaterial );
        this.plateMesh.rotation.x = -Math.PI;
        this.app.scene.add( this.plateMesh );
        
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
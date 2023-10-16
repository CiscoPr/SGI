import * as THREE from 'three';

/**
 * Kirby class
 */
class MyKirby {
    /**
     * constructs the object
     * @param {THREE.Scene} scene The application scene
     */
    constructor(scene) {
        this.scene = scene;

        // app properties
        this.kirbyMesh = null;
        this.castShadow = true;
        this.receiveShadow = true;

        // kirby material properties
        this.color = "#ff0000";
        this.specular = "#000000";
        this.emissive = "#000000";
        this.shininess = 90;

        // build the kirby mesh
        this.buildKirby();
    }

    buildKirby() {
        //loads the texture
        let kirbyTexture = new THREE.TextureLoader().load("textures/kirby.jpg");

        kirbyTexture.wrapS = THREE.RepeatWrapping;

        kirbyTexture.wrapT = THREE.RepeatWrapping;

        let kirbyMaterial = new THREE.MeshPhongMaterial({
        color: "#ffffff",

        specular: "#000000",

        emissive: "#000000",
        shininess: 90,

        map: kirbyTexture,
        });

        let kirbyHandsMaterial = new THREE.MeshPhongMaterial({
        color: "#d5afaf",

        specular: "#000000",

        emissive: "#000000",
        shininess: 90,
        });

        let kirbyFeetMaterial = new THREE.MeshPhongMaterial({
        color: "#800051",

        specular: "#000000",

        emissive: "#000000",
        shininess: 90,
        });

        let kirby = new THREE.SphereGeometry(1, 32, 32);
        let kirbyHands = new THREE.SphereGeometry(0.3, 32, 32);
        let kirbyFeet = new THREE.CylinderGeometry(0.4, 0.5, 0.3, 32);

        this.kirbyMesh = new THREE.Mesh(kirby, kirbyMaterial);

        this.kirbyMesh.position.y = 1;

        this.kirbyMesh.position.x = 3;

        let rightHand = new THREE.Mesh(kirbyHands, kirbyHandsMaterial);
        rightHand.position.y = 0.7;
        rightHand.position.x = 3;
        rightHand.position.z = 0.9;

        let leftHand = new THREE.Mesh(kirbyHands, kirbyHandsMaterial);
        leftHand.position.y = 0.7;
        leftHand.position.x = 3;
        leftHand.position.z = -0.9;

        let rightFoot = new THREE.Mesh(kirbyFeet, kirbyFeetMaterial);
        rightFoot.position.y = 0.1;
        rightFoot.position.x = 3;
        rightFoot.position.z = 0.65;
        let leftFoot = new THREE.Mesh(kirbyFeet, kirbyFeetMaterial);
        leftFoot.position.y = 0.1;
        leftFoot.position.x = 3;
        leftFoot.position.z = -0.65;

        this.kirbyMesh.castShadow = true;
        this.kirbyMesh.receiveShadow = true;
        rightHand.castShadow = true;
        rightHand.receiveShadow = true;
        leftHand.castShadow = true;
        leftHand.receiveShadow = true;


        let kirbyGroup = new THREE.Group();
        kirbyGroup.add(this.kirbyMesh);
        kirbyGroup.add(rightHand);
        kirbyGroup.add(leftHand);
        kirbyGroup.add(rightFoot);
        kirbyGroup.add(leftFoot);

        kirbyGroup.scale.set(0.75, 0.75, 0.75);
        kirbyGroup.position.x = -5;

        this.scene.add(kirbyGroup);
    }

    rebuildKirby() {
        // remove kirbyMesh if exists
        if (this.kirbyMesh !== undefined && this.kirbyMesh !== null) {
            this.scene.remove(this.kirbyMesh)
        }
        this.buildKirby();
    }
}
export { MyKirby };
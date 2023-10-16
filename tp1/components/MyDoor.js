import * as THREE from 'three';

/**
 * Door class
 */
class MyDoor{
    /**
     * constructs the object
     * @param {THREE.Scene} scene The application scene
     */
    constructor(scene) {
        this.scene = scene;

        // app properties
        this.doorMesh = null;
        this.doorHandleMesh = null;
        this.doorTexture = new THREE.TextureLoader().load("textures/door.jpg");
        this.color = "#ffffff";
        this.specular = "#000000";
        this.emissive = "#000000";
        this.shininess = 90;

        // build the door mesh
        this.buildDoor();
    }

    buildDoor() {
        let doorMaterial = new THREE.MeshPhongMaterial({
            color: this.color,
            specular: this.specular,
            emissive: this.emissive,
            shininess: this.shininess,
            map: this.doorTexture,
        });

        // build the door mesh
        let doorGeometry = new THREE.BoxGeometry(2.0, 3.0, 0.1);

        this.doorMesh = new THREE.Mesh(doorGeometry, doorMaterial);

        this.doorMesh.rotation.y = Math.PI / 2;
        this.scene.add(this.doorMesh);
    }

    rebuildDoor() {
        // remove doorMesh if exists
        if (this.doorMesh !== undefined && this.doorMesh !== null) {
            this.scene.remove(this.doorMesh)
        }
        this.buildDoor();
    }
}
export { MyDoor };
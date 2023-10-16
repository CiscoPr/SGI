import * as THREE from 'three';

/**
 * Rug class
 */
class MyRug{
    /**
     * constructs the object
     * @param {THREE.Scene} scene The application scene
     */
    constructor(scene) {
        this.scene = scene;

        // app properties
        this.rugMesh = null;
        this.rugTexture = new THREE.TextureLoader().load("textures/rug.jpg");
        this.rugTexture.wrapS = THREE.RepeatWrapping;
        this.rugTexture.wrapT = THREE.RepeatWrapping;
        this.rugTexture.repeat.set(5, 5);
        this.color = "#ffffff";
        this.specular = "#000000";
        this.emissive = "#000000";
        this.shininess = 90;

        // build the door mesh
        this.buildRug();
    }

    buildRug() {
        let rugMaterial = new THREE.MeshPhongMaterial({
            color: this.color,
            specular: this.specular,
            emissive: this.emissive,
            shininess: this.shininess,
            map: this.rugTexture
        });

        // build the door mesh
        let rugGeometry = new THREE.BoxGeometry(5.0, 5.0, 0.1);

        this.rugMesh = new THREE.Mesh(rugGeometry, rugMaterial);

        this.rugMesh.rotation.x = Math.PI / 2;
        this.scene.add(this.rugMesh);
    }

    rebuildRug() {
        // remove doorMesh if exists
        if (this.rugMesh !== undefined && this.rugMesh !== null) {
            this.scene.remove(this.rugMesh)
        }
        this.buildRug();
    }
}
export { MyRug };
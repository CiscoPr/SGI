import * as THREE from 'three';

/**
 * Clock class
 */

class MyClock{
    /**
     * constructs the object
     * @params {THREE.scene} scene
     */
    constructor(scene) {
        this.scene = scene; 
        this.clockMesh = null;
        this.clockTexture = new THREE.TextureLoader().load("textures/clock.png");
        this.color = "#ffffff";
        this.specular = "#000000";
        this.emissive = "#000000";
        this.shininess = 90;

        this.buildClock();
    }

    buildClock() {
        let clockMaterial = new THREE.MeshPhongMaterial({
            color: this.color,
            specular: this.specular,
            emissive: this.emissive,
            shininess: this.shininess,
            map: this.clockTexture,
        })

        //build the clock mesh
        let clockGeometry = new THREE.CircleGeometry(1.0)
        this.clockMesh = new THREE.Mesh(clockGeometry, clockMaterial);

        this.clockMesh.rotation.y = -Math.PI / 2;
        this.scene.add(this.clockMesh);
    }

    rebuildClock() {
        // remove Mesh if exists
        if (this.clockMesh !== undefined && this.clockMesh !== null) {
            this.scene.remove(this.clockMesh)
        }
        this.buildClock();
    }
}
export { MyClock };
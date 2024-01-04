import * as THREE from 'three';

class MyBoost {
    constructor(type, position, scene) {
        this.mesh = null;
        this.helper = new THREE.Group();
        this.type = type;
        this.position = position;
        this.radius = 20;
        this.active = true;

        this.build(scene);
    }    

    build(scene) {
        if (this.type === 'speed') {
            const geometry = new THREE.IcosahedronGeometry( this.radius - 1, 0 );
            this.mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({color: '#00ff00'}) );
        } else if (this.type === 'time') {
            const geometry = new THREE.IcosahedronGeometry( this.radius - 1, 0 );
            this.mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({color: '#0000ff'}) );
        }
        this.helper.add(this.mesh);

        // set position
        let x = this.position.x;
        let y = this.position.y;
        let z = this.position.z;
        this.helper.position.set(x, y, z);

        // add to scene
        scene.add(this.helper);
    }
}

export { MyBoost };
import * as THREE from 'three';

class MyBoost {
    constructor(type, position, scene) {
        this.mesh = null;
        this.helper = new THREE.Group();
        this.type = type;
        this.position = position;
        this.radius = 20;

        this.build(scene);
    }    

    build(scene) {
        if (this.type === 'speed') {
            const geometry = new THREE.IcosahedronGeometry( this.radius - 1, 0 );
            this.mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({color: '#00ff00'}) );
        } else {
            // include second type of boost
        }
        this.helper.add(this.mesh);

        // add sphere helper
        const geometry = new THREE. SphereGeometry(this.radius);
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        material.wireframe = true;
        this.helper.add(new THREE.Mesh(geometry, material));

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
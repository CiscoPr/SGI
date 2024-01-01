import * as THREE from 'three';

class MyObstacle {
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
            const geometry = new THREE.OctahedronGeometry( this.radius - 1, 0 );
            this.mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({color: '#ff0000'}) );
            this.mesh.castShadow = true;
        } else if (this.type === 'time') {
            const geometry = new THREE.OctahedronGeometry( this.radius - 1, 0 );
            this.mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: '#ffa500' }));
            this.mesh.castShadow = true;
        }
        this.helper.add(this.mesh);

        // add sphere helper
        const geometry = new THREE.SphereGeometry(this.radius);
        const material = new THREE.MeshBasicMaterial({color: 0xff0000});
        material.wireframe = true;
        //this.helper.add(new THREE.Mesh(geometry, material));

        // set position
        let x = this.position.x;
        let y = this.position.y;
        let z = this.position.z;
        this.helper.position.set(x, y, z);

        // add to scene
        scene.add(this.helper);
    }
}

export { MyObstacle };
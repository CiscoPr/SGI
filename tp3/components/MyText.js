import * as THREE from 'three';

class MyText  {
    constructor() {
        this.group = null;
    }

    /**
     * initializes the contents
     */
    init(string) {
        this.group = new THREE.Group();
        for (let i = 0; i < string.length; i++) {
            let pos = string.charCodeAt(i);
            let j = Math.floor(pos / 16);
            let k = pos % 16;
            let letter = new THREE.PlaneGeometry( 1, 1 );
            let texture = new THREE.TextureLoader().load( 'scene/textures/elements/spriteLetters.png' );
            texture.flipY = false;
            let offset = 1 / 16;
            let uv = [];
            uv.push(offset * k + offset, offset * j + offset);
            uv.push(offset * k, offset * j + offset);
            uv.push(offset * k + offset, offset * j);
            uv.push(offset * k, offset * j);
            letter.setAttribute("uv", new THREE.BufferAttribute( new Float32Array(uv), 2 ));
            let material = new THREE.MeshPhongMaterial( { map: texture } ); 
            material.transparent = true;
            let mesh = new THREE.Mesh( letter, material );
            mesh.rotation.z = Math.PI;
            mesh.position.x = i;
            this.group.add(mesh);
        }
    }

}

export { MyText };
import * as THREE from 'three';

class MyText  {
    constructor(maxSize) {
        this.maxSize = maxSize;
    }

    init(group) {
        for (let i = 0; i < this.maxSize; i++) {
            // set new Char Mesh UV
            let uv = this.getUV(32);

            // create geometry
            let letter = new THREE.PlaneGeometry( 1, 1 );
            letter.setAttribute("uv", new THREE.BufferAttribute( new Float32Array(uv), 2 ));

            // load texture
            let texture = new THREE.TextureLoader().load( 'scene/textures/elements/spriteLetters.png' );
            texture.flipY = false;

            // create material
            let material = new THREE.MeshPhongMaterial( { map: texture } ); 
            material.transparent = true;

            // create and modify mesh
            let mesh = new THREE.Mesh( letter, material );
            mesh.rotation.z = Math.PI;
            mesh.position.x = i;

            // add mesh to group
            group.add(mesh);
        }
    }

    load(group, string) {
        for (let i = 0; i < group.children.length; i++) {
            // get Char Mesh
            let letter = group.children[i].geometry;

            // set new Char Mesh UV
            let uv = null;
            if (i < string.length) uv = this.getUV(string.charCodeAt(i));             
            else uv = this.getUV(32);

            // upload new Char Mesh
            letter.setAttribute("uv", new THREE.BufferAttribute( new Float32Array(uv), 2 ));

            // signal three.js for update
            let attribute = letter.getAttribute("uv");
            attribute.needsUpdate = true;  
        }
    }

    getUV(code) {
        let j = Math.floor(code / 16);
        let k = code % 16;
        let offset = 1 / 16;
        let uv = [];
        uv.push(offset * k + offset, offset * j + offset);
        uv.push(offset * k, offset * j + offset);
        uv.push(offset * k + offset, offset * j);
        uv.push(offset * k, offset * j);

        return uv;
    }

}

export { MyText };
import * as THREE from 'three';

class InputMenu {
    constructor(app, menu){
        this.app = app;
        this.menu = menu;
        this.input = "";
        this.spriteGroup = null;
        this.build();
    }

    build(){
        this.spriteGroup = new THREE.Group();
        this.input = "ma";
        for (let i = 0; i < this.input.length; i++) {
            let pos = this.input.charCodeAt(i);
            let j = Math.floor(pos / 16);
            let k = pos % 16;
            let letter = new THREE.PlaneGeometry( 1, 1 );
            let texture = new THREE.TextureLoader().load( 'sprites/spriteLetters.png' );
            texture.flipY = false;
            let offset = 1 / 16;
            let uv = [];
            uv.push(offset * k + offset, offset * j + offset);
            uv.push(offset * k, offset * j + offset);
            uv.push(offset * k + offset, offset * j);
            uv.push(offset * k, offset * j);
            letter.setAttribute("uv", new THREE.BufferAttribute( new Float32Array(uv), 2 ));
            let material = new THREE.MeshBasicMaterial( { map: texture } );
            material.transparent = true;
            material.side = THREE.DoubleSide;
            let mesh = new THREE.Mesh( letter, material );
            mesh.rotation.z = Math.PI;
            mesh.position.x = i;
            this.spriteGroup.add(mesh);
        }

        this.spriteGroup.scale.x = 100;
        this.spriteGroup.scale.y = 100;
        this.spriteGroup.scale.z = 100;

        //get the width of the spriteGroup
        let width = 0;
        for(let i = 0; i < this.spriteGroup.children.length; i++){
            width += this.spriteGroup.children[i].geometry.parameters.width;
        }

        //center the spriteGroup
        this.spriteGroup.position.x = 0;
        this.spriteGroup.position.z = 0;
        this.spriteGroup.position.y = 800



        //console.log("group", this.spriteGroup)

        this.app.scene.add( this.spriteGroup );

    }

    update(){

        this.spriteGroup.lookAt(this.app.activeCamera.position);

    }

}
export {InputMenu};
import * as THREE from 'three';
import { PickingController } from './PickingController.js';

class InputMenu {
    constructor(app){
        this.app = app;
        this.input = "";
        this.spriteGroup = null;

        this.raycaster = new THREE.Raycaster();
        this.raycaster.near = 1;
        this.raycaster.far = 1100;

        this.pointer = new THREE.Vector2();
        this.intersectedObj = null;
        this.pickingColor = "0xCFE6FF";

        this.availableLayers = ['none', 5, 6]
        this.selectedLayer = this.availableLayers[0]

        this.notPickableObjIds = ["inputBox"]

        //the usual flag to check it is done
        this.inputDone = false;


        this.pickingController = new PickingController(this.app, this.raycaster, this.pointer, this.intersectedObj, this.pickingColor, this.availableLayers, this.selectedLayer, this.notPickableObjIds);

        this.build();

        this.mousePressed = false;



        window.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        window.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    }

    removeEventListeners() {
        window.removeEventListener('mousedown', (e) => this.handleMouseDown(e));
        window.removeEventListener('mouseup', (e) => this.handleMouseUp(e));
    }

    handleMouseDown(event) {
        //of the screen is the origin
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        switch (event.button) {
            case 0:
                this.mousePressed = true;
                console.log("Position x: " + this.pointer.x + " y: " + this.pointer.y);
                // if the mouse clicks on the start game button
                if(this.pointer.x > -0.26 && this.pointer.x < 0.275 && this.pointer.y > -0.51 && this.pointer.y < -0.23){
                    this.inputDone = true;
                }
                break;
        }
    }

    handleMouseUp(event) {
        switch (event.button) {
            case 0:
                this.mousePressed = false;
                break;
        }
    }

    build(){

        this.buildInput("inputBox", 5);
        this.buildNextButton("nextButton", 6);

    }

    buildInput(name, layer){
        this.spriteGroup = new THREE.Group();
        this.input = "Your name:";
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
            if(i == 0)
                mesh.position.x = -10;
            else
                mesh.position.x = i - 10;
            mesh.name = name;
            mesh.layers.enable(layer);
            this.spriteGroup.add(mesh);
        }

        this.spriteGroup.scale.x = 100;
        this.spriteGroup.scale.y = 100;
        this.spriteGroup.scale.z = 100;

        this.spriteGroup.name = name;
        this.spriteGroup.layers.enable(layer);

        //center the spriteGroup
        this.spriteGroup.position.x = 0;
        this.spriteGroup.position.z = 0;
        this.spriteGroup.position.y = 900;




        //console.log("group", this.spriteGroup)

        this.app.scene.add( this.spriteGroup );
    }

    buildNextButton(name, layer){
        const nextGeometry = new THREE.PlaneGeometry(500, 250);
        const nextMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});

        nextMaterial.transparent = true;
        nextMaterial.side = THREE.DoubleSide;
        this.nextButton = new THREE.Mesh(nextGeometry, nextMaterial);

        this.nextButton.position.set(0, 500, 0);
        this.nextButton.name = name;
        this.nextButton.layers.enable(layer);

        // apply texture
        const loader = new THREE.TextureLoader();
        const texture = loader.load('./scene/textures/elements/nextButton.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        this.nextButton.material.map = texture;
        this.nextButton.material.side = THREE.DoubleSide;
        this.app.scene.add(this.nextButton);
    }


    update(){
        this.nextButton.lookAt(this.app.activeCamera.position.x, this.nextButton.position.y, this.app.activeCamera.position.z);
        this.spriteGroup.lookAt(this.app.activeCamera.position.x, this.spriteGroup.position.y, this.app.activeCamera.position.z);
        if(this.inputDone === true){
            this.app.scene.remove(this.spriteGroup);
            this.app.scene.remove(this.nextButton);
            this.raycaster.near = 0;
            this.raycaster.far = 0;
        }
    }

}
export {InputMenu};
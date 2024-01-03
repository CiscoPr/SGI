import * as THREE from 'three';
import { PickingController } from './PickingController.js';

class InputMenu {
    constructor(app){
        this.app = app;
        this.input = "";
        this.spriteGroup = null;
        this.inputGroup = null;

        this.raycaster = new THREE.Raycaster();
        this.raycaster.near = 1;
        this.raycaster.far = 1100;

        this.pointer = new THREE.Vector2();
        this.intersectedObj = null;
        this.pickingColor = "0xCFE6FF";

        this.availableLayers = ['none', 1, 2, 3]
        this.selectedLayer = this.availableLayers[0]

        this.notPickableObjIds = ["inputBox"]

        //the usual flag to check it is done
        this.inputDone = false;

        //flag to check if the escape key has been pressed
        this.escapePressed = false;

        this.pickingController = new PickingController(this.app, this.raycaster, this.pointer, this.intersectedObj, this.pickingColor, this.availableLayers, this.selectedLayer, this.notPickableObjIds);

        this.build();

        this.mousePressed = false;


        window.addEventListener('keydown', (e) => this.handleKeyDown(e));

        window.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        window.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    }

    handleMouseDown(event) {
        //of the screen is the origin
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        if(this.inputDone || this.escapePressed) return;
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

    handleKeyDown(event) {
        if(this.inputDone || this.escapePressed) return;
        console.log("key activated")
        switch (event.key) {
            case "Escape":
                this.escapePressed = true;
                break;
            case "Backspace":
                if(this.input.length > 0)
                this.input = this.input.slice(0, -1);
                break;
            case "q":
                if(this.input.length <= 5)
                this.input += "q";
                break;
            case "w":
                if(this.input.length <= 5)
                this.input += "w";
                break;
            case "e":
                if(this.input.length <= 5)
                this.input += "e";
                break;
            case "r":
                if(this.input.length <= 5)
                this.input += "r";
                break;
            case "t":
                if(this.input.length <= 5)
                this.input += "t";
                break;
            case "y":
                if(this.input.length <= 5)
                this.input += "y";
                break;
            case "u":
                if(this.input.length <= 5)
                this.input += "u";
                break;
            case "i":
                if(this.input.length <= 5)
                this.input += "i";
                break;
            case "o":
                if(this.input.length <= 5)
                this.input += "o";
                break;
            case "p":
                if(this.input.length <= 5)
                this.input += "p";
                break;
            case "a":
                if(this.input.length <= 5)
                this.input += "a";
                break;
            case "s":
                if(this.input.length <= 5)
                this.input += "s";
                break;
            case "d":
                if(this.input.length <= 5)
                this.input += "d";
                break;
            case "f":
                if(this.input.length <= 5)
                this.input += "f";
                break;
            case "g":
                if(this.input.length <= 5)
                this.input += "g";
                break;
            case "h":
                if(this.input.length <= 5)
                this.input += "h";
                break;
            case "j":
                if(this.input.length <= 5)
                this.input += "j";
                break;
            case "k":
                if(this.input.length <= 5)
                this.input += "k";
                break;
            case "l":
                if(this.input.length <= 5)
                this.input += "l";
                break;
            case "z":
                if(this.input.length <= 5)
                this.input += "z";
                break;
            case "x":
                if(this.input.length <= 5)
                this.input += "x";
                break;
            case "c":
                if(this.input.length <= 5)
                this.input += "c";
                break;
            case "v":
                if(this.input.length <= 5)
                this.input += "v";
                break;
            case "b":
                if(this.input.length <= 5)
                this.input += "b";
                break;
            case "n":
                if(this.input.length <= 5)
                this.input += "n";
                break;
            case "m":
                if(this.input.length <= 5)
                this.input += "m";
                break;
            default:
                break;
        }
        this.app.scene.remove(this.inputGroup);
        this.updateInputBox(this.input, "inputBox", 3);
    }

    updateInputBox(input, name, layer) {
        this.inputGroup = new THREE.Group();
        input = input.toLowerCase();
        for (let i = 0; i < input.length; i++) {
            let pos = input.charCodeAt(i);
            let j = Math.floor(pos / 16);
            let k = pos % 16;
            let letter = new THREE.PlaneGeometry( 1, 1 );
            let texture = new THREE.TextureLoader().load( './scene/textures/elements/spriteLetters.png' );
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
                mesh.position.x = 1;
            else
                mesh.position.x = i + 1;
            mesh.name = name;
            mesh.layers.enable(layer);
            this.inputGroup.add(mesh);
        }

        this.inputGroup.scale.x = 100;
        this.inputGroup.scale.y = 100;
        this.inputGroup.scale.z = 100;

        this.inputGroup.name = name;
        this.inputGroup.layers.enable(layer);

        //center the spriteGroup
        this.inputGroup.position.x = 0;
        this.inputGroup.position.z = 0;
        this.inputGroup.position.y = 900;

        this.app.scene.add( this.inputGroup );
    }

    handleMouseUp(event) {
        switch (event.button) {
            case 0:
                this.mousePressed = false;
                break;
        }
    }

    build(){

        this.buildPlaceholder("inputBox", 1);
        this.buildNextButton("nextButton", 2);

    }

    buildPlaceholder(name, layer){
        this.spriteGroup = new THREE.Group();
        const placeHolder = "Your name:";
        for (let i = 0; i < placeHolder.length; i++) {
            let pos = placeHolder.charCodeAt(i);
            let j = Math.floor(pos / 16);
            let k = pos % 16;
            let letter = new THREE.PlaneGeometry( 1, 1 );
            let texture = new THREE.TextureLoader().load( './scene/textures/elements/spriteLetters.png' );
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

    getInputName() {
        return this.input;
    }

    getEscapePressed(){
        return this.escapePressed;
    }

    update(){
        this.nextButton.lookAt(this.app.activeCamera.position.x, this.nextButton.position.y, this.app.activeCamera.position.z);
        this.spriteGroup.lookAt(this.app.activeCamera.position.x, this.spriteGroup.position.y, this.app.activeCamera.position.z);
        if(this.inputGroup!= null)this.inputGroup.lookAt(this.app.activeCamera.position.x, this.inputGroup.position.y, this.app.activeCamera.position.z);
        if(this.inputDone === true || this.escapePressed === true){
            this.app.scene.remove(this.spriteGroup);
            this.app.scene.remove(this.inputGroup);
            this.app.scene.remove(this.nextButton);
            this.raycaster.near = 0;
            this.raycaster.far = 0;
        }

    }

}
export {InputMenu};